import fs from "fs";
import path from "path";

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".jfif"];

export function generateManifest() {
  const publicFolder = path.join(process.cwd(), "public"); // ✅ always points to project root
  const files = fs.readdirSync(publicFolder);

  const images = files
    .filter((file) => imageExtensions.includes(path.extname(file).toLowerCase()))
    .map((file) => `/${file}`);

  fs.writeFileSync(
    path.join(publicFolder, "gallery-manifest.json"),
    JSON.stringify(images, null, 2)
  );

  console.log(`✅ Manifest generated with ${images.length} images`);
}
generateManifest(); // add this line at the end