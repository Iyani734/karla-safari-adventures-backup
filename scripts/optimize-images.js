import sharp from "sharp";
import fs from "fs";
import path from "path";

// Folders
const inputDir = "./public/original";
const outputDir = "./public/webp";

// Create output folder if it doesn't exist
fs.mkdirSync(outputDir, { recursive: true });

// Read all files from both directories
const originalFiles = fs.readdirSync(inputDir);
const existingWebpFiles = fs.readdirSync(outputDir);

// Create a Set of existing webp filenames for quick lookup
const existingWebpSet = new Set(
  existingWebpFiles.map(file => file.replace(/\.webp$/i, "").toLowerCase())
);

// Find missing images
const missingImages = [];
const webpToCopy = [];
const svgToCopy = [];

for (const file of originalFiles) {
  // Handle files already in WebP format - just copy them
  if (file.match(/\.webp$/i)) {
    const baseName = file.replace(/\.webp$/i, "").toLowerCase();
    if (!existingWebpSet.has(baseName)) {
      webpToCopy.push(file);
    }
    continue;
  }

  // Handle SVG files - copy them as-is
  if (file.match(/\.svg$/i)) {
    if (!fs.existsSync(path.join(outputDir, file))) {
      svgToCopy.push(file);
    }
    continue;
  }

  // Check image files that need conversion (including.webp and JFIF)
  if (!file.match(/\.(jpg|jpeg|png|gif|bmp|tiff.webp|jfif)$/i)) continue;

  // Generate the expected WebP filename (with sanitization)
  const safeFile = file.replace(/\s/g, "_").replace(/[^\w.-]/g, "");
  const expectedWebpName = safeFile
    .replace(/\.(jpg|jpeg|png|gif|bmp|tiff.webp|jfif)$/i, "")
    .toLowerCase();

  // Check if the WebP version exists
  if (!existingWebpSet.has(expectedWebpName)) {
    missingImages.push(file);
  }
}

// Display comparison results
console.log("📊 Comparison Results:");
console.log(`Total image files in original: ${originalFiles.filter(f => f.match(/\.(jpg|jpeg|png|gif|bmp|tiff.webp|jfif|webp)$/i)).length}`);
console.log(`Existing WebP images: ${existingWebpFiles.length}`);
console.log(`\nMissing files:`);
console.log(`  - To convert: ${missingImages.length}`);
console.log(`  - WebP to copy: ${webpToCopy.length}`);
console.log(`  - SVG to copy: ${svgToCopy.length}`);
console.log(`  - Total missing: ${missingImages.length + webpToCopy.length + svgToCopy.length}\n`);

if (missingImages.length === 0 && webpToCopy.length === 0 && svgToCopy.length === 0) {
  console.log("✅ All images are already in the output folder! Nothing to do.");
  process.exit(0);
}

// Show which images will be processed
if (missingImages.length > 0) {
  console.log("🔄 Images to convert:");
  missingImages.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });
  console.log();
}

if (webpToCopy.length > 0) {
  console.log("📋 WebP files to copy:");
  webpToCopy.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });
  console.log();
}

if (svgToCopy.length > 0) {
  console.log("📋 SVG files to copy:");
  svgToCopy.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });
  console.log();
}

console.log("🚀 Starting processing...\n");

// Keep track of results
const failedFiles = [];
const copiedFiles = [];

async function processAllFiles() {
  // Copy WebP files
  for (const file of webpToCopy) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    try {
      fs.copyFileSync(inputPath, outputPath);
      console.log(`✅ Copied (WebP): ${file}`);
      copiedFiles.push(file);
    } catch (err) {
      console.error(`❌ Failed to copy: ${file} → ${err.message}`);
      failedFiles.push(file);
    }
  }

  // Copy SVG files
  for (const file of svgToCopy) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);

    try {
      fs.copyFileSync(inputPath, outputPath);
      console.log(`✅ Copied (SVG): ${file}`);
      copiedFiles.push(file);
    } catch (err) {
      console.error(`❌ Failed to copy: ${file} → ${err.message}`);
      failedFiles.push(file);
    }
  }

  // Convert other images
  for (const file of missingImages) {
    // Sanitize filename
    const safeFile = file.replace(/\s/g, "_").replace(/[^\w.-]/g, "");

    const inputPath = path.join(inputDir, file);
    const webpOutputPath = path.join(
      outputDir,
      safeFile.replace(/\.(jpg|jpeg|png|gif|bmp|tiff.webp|jfif)$/i, ".webp")
    );

    try {
      // Convert to WebP
      await sharp(inputPath)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(webpOutputPath);

      console.log(`✅ Converted: ${file}`);
    } catch (err) {
      console.error(`❌ Failed: ${file} → ${err.message}`);
      failedFiles.push(file);
    }
  }

  // Final summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 PROCESSING SUMMARY");
  console.log("=".repeat(60));
  console.log(`✅ Successfully converted: ${missingImages.length - failedFiles.filter(f => missingImages.includes(f)).length}`);
  console.log(`✅ Successfully copied: ${copiedFiles.length}`);
  
  if (failedFiles.length > 0) {
    console.log(`❌ Failed: ${failedFiles.length}`);
    console.log("\n⚠️  Failed files:");
    failedFiles.forEach((f) => console.log(`   - ${f}`));
    
    // Save failed files list
    fs.writeFileSync("./failed-conversions.txt", failedFiles.join("\n"));
    console.log("\n📝 Failed files saved to: failed-conversions.txt");
  } else {
    console.log("\n🎉 All files processed successfully!");
  }
  console.log("=".repeat(60));
}

// Run the processing
processAllFiles();