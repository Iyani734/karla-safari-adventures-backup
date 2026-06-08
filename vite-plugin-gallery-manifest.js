// vite-plugin-gallery-manifest.js
import { readdirSync, writeFileSync, existsSync } from "fs";
import { join, extname } from "path";
import chokidar from "chokidar";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

function buildManifest(root) {
  const publicDir = join(root, "public");
  const outputFile = join(publicDir, "gallery-manifest.json");

  if (!existsSync(publicDir)) {
    writeFileSync(outputFile, "[]");
    return 0;
  }

  const files = readdirSync(publicDir)
    .filter((f) => IMAGE_EXTENSIONS.has(extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
    .map((f) => `/${f}`);

  writeFileSync(outputFile, JSON.stringify(files, null, 2));
  return files.length;
}

export function galleryManifestPlugin() {
  return {
    name: "gallery-manifest",

    buildStart() {
      const count = buildManifest(process.cwd());
      console.log(`[gallery-manifest] ✅ ${count} image(s) indexed`);
    },

    configureServer(server) {
      const root = process.cwd();
      const publicDir = join(root, "public");

      // Dedicated chokidar watcher scoped ONLY to image files in public/
      // This is completely separate from Vite's own watcher — no cross-contamination
      const watcher = chokidar.watch(
        IMAGE_EXTENSIONS.size
          ? [...IMAGE_EXTENSIONS].map((ext) => join(publicDir, `*${ext}`))
          : [],
        {
          ignoreInitial: true,   // don't fire for files already there on startup
          persistent: true,
          usePolling: false,     // use native fs events, not polling
        }
      );

      let debounce;
      const refresh = (filePath) => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          const count = buildManifest(root);
          console.log(`[gallery-manifest] 🔄 Image changed: ${filePath} — ${count} total`);
          server.ws.send({ type: "full-reload" });
        }, 500);
      };

      watcher.on("add", refresh);
      watcher.on("unlink", refresh);

      // Clean up when dev server stops
      server.httpServer?.on("close", () => watcher.close());
    },
  };
}