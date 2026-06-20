const fs = require('fs');
const path = require('path');

function convertPngToIco(pngPath, icoPath) {
  try {
    if (!fs.existsSync(pngPath)) {
      console.log(`Source PNG not found at: ${pngPath}`);
      return false;
    }

    const pngBuffer = fs.readFileSync(pngPath);
    console.log(`Loaded PNG from ${pngPath} (${pngBuffer.length} bytes)`);

    // Parse PNG width and height from IHDR chunk (starts at byte 16)
    // PNG file signature is 8 bytes. IHDR chunk starts at byte 12 with:
    // length (4 bytes), type "IHDR" (4 bytes), width (4 bytes), height (4 bytes)
    const width = pngBuffer.readInt32BE(16);
    const height = pngBuffer.readInt32BE(20);
    console.log(`Detected PNG dimensions: ${width}x${height}`);

    // Create 6-byte ICO Header
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // Reserved
    header.writeUInt16LE(1, 2); // Type (1 = icon)
    header.writeUInt16LE(1, 4); // Number of images (1)

    // Create 16-byte ICO Directory Entry
    const dirEntry = Buffer.alloc(16);
    // If dimensions are >= 256, Windows expects 0
    const icoWidth = width >= 256 ? 0 : width;
    const icoHeight = height >= 256 ? 0 : height;

    dirEntry.writeUInt8(icoWidth, 0);      // Width
    dirEntry.writeUInt8(icoHeight, 1);     // Height
    dirEntry.writeUInt8(0, 2);             // Color palette (0 = no palette)
    dirEntry.writeUInt8(0, 3);             // Reserved (must be 0)
    dirEntry.writeUInt16LE(1, 4);          // Color planes (1)
    dirEntry.writeUInt16LE(32, 6);         // Bits per pixel (32-bit for transparency)
    dirEntry.writeUInt32LE(pngBuffer.length, 8); // Size of PNG data
    dirEntry.writeUInt32LE(22, 12);        // Offset of PNG data in ICO (6 header + 16 dir entry = 22)

    // Combine into final ICO Buffer
    const icoBuffer = Buffer.concat([header, dirEntry, pngBuffer]);
    fs.writeFileSync(icoPath, icoBuffer);
    console.log(`Successfully compiled and wrote Windows ICO to ${icoPath} (${icoBuffer.length} bytes)`);
    return true;
  } catch (err) {
    console.error(`Error converting ${pngPath} to ICO:`, err);
    return false;
  }
}

// Perform conversions for public and dist
console.log('--- Compilation of FoodNet Branding ico ---');
const successPublic = convertPngToIco(
  path.join(__dirname, 'public', 'foodnet.png'),
  path.join(__dirname, 'public', 'favicon.ico')
);

if (successPublic) {
  // Also copy to dist if dist exists
  const distIco = path.join(__dirname, 'dist', 'favicon.ico');
  const publicIco = path.join(__dirname, 'public', 'favicon.ico');
  try {
    if (fs.existsSync(path.dirname(distIco))) {
      fs.copyFileSync(publicIco, distIco);
      console.log(`Copied compiled icon to production build: ${distIco}`);
    }
  } catch (err) {
    console.error('Failed to copy to dist:', err);
  }
}
