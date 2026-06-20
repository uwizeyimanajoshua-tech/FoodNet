import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

// Recursive folder walker
function getFilesRecursively(dir, baseDir = dir) {
  const files = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      // Skip node_modules or system build folders
      if (file !== 'node_modules' && file !== '.git') {
        files.push(...getFilesRecursively(fullPath, baseDir));
      }
    } else {
      const relativePath = path.relative(baseDir, fullPath);
      files.push({ fullPath, relativePath });
    }
  }
  return files;
}

try {
  const distDir = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distDir)) {
    console.error('Error: dist/ directory does not exist yet. Run vite build first.');
    process.exit(1);
  }

  const zip = new JSZip();
  const files = getFilesRecursively(distDir);
  let addedCount = 0;

  // Add files to ZIP
  for (const file of files) {
    // Skip backend server bundles to keep client setup minimal and confidential
    if (file.relativePath.startsWith('server.cjs') || file.relativePath.startsWith('server.js') || file.relativePath.endsWith('.map')) {
      continue;
    }
    const content = fs.readFileSync(file.fullPath);
    zip.file(file.relativePath, content);
    addedCount++;
  }

  // Generate ZIP file buffer
  zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } })
    .then((buffer) => {
      // Write zip file directly to both dist and public
      const distZipPath = path.join(distDir, 'foodnet-portable-setup.zip');
      fs.writeFileSync(distZipPath, buffer);
      console.log(`Successfully generated Portable Setup Zip at: ${distZipPath} (${addedCount} static files archived)`);
      
      // Also copy to public directory so it's persistent in the codebase and can be pre-cached
      const publicDir = path.join(process.cwd(), 'public');
      if (fs.existsSync(publicDir)) {
        const publicZipPath = path.join(publicDir, 'foodnet-portable-setup.zip');
        fs.writeFileSync(publicZipPath, buffer);
        console.log(`Successfully replicated Portable Setup Zip to public at: ${publicZipPath}`);
      }
    })
    .catch((err) => {
      console.error('Failed to generate zip buffer:', err);
    });

} catch (e) {
  console.error('Error in zip-building script:', e);
}
