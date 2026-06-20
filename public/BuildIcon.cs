using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

public class BuildIcon {
    public static void Main() {
        try {
            string srcPath = "foodnet.png";
            if (!File.Exists(srcPath)) {
                srcPath = "logo.png";
            }
            if (!File.Exists(srcPath)) {
                Console.WriteLine("Error: Source branding image (foodnet.png/logo.png) not found.");
                return;
            }
            
            Console.WriteLine("Found branding image: " + srcPath + ". Compiling high-DPI multi-resolution Windows Icon...");

            using (Bitmap source = new Bitmap(srcPath)) {
                // We compile a standard 256x256 high-resolution icon centered in Windows.
                int size = 256;
                using (Bitmap target = new Bitmap(size, size, PixelFormat.Format32bppArgb)) {
                    using (Graphics g = Graphics.FromImage(target)) {
                        g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                        g.SmoothingMode = SmoothingMode.HighQuality;
                        g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                        g.CompositingQuality = CompositingQuality.HighQuality;
                        g.Clear(Color.Transparent);
                        
                        // Maintain original aspect ratio or scale to fit beautifully
                        float ratio = Math.Min((float)size / source.Width, (float)size / source.Height);
                        int destWidth = (int)(source.Width * ratio);
                        int destHeight = (int)(source.Height * ratio);
                        int destX = (size - destWidth) / 2;
                        int destY = (size - destHeight) / 2;

                        g.DrawImage(source, destX, destY, destWidth, destHeight);
                    }
                    
                    // Save as standard transparent format inside a .ICO capsule stream
                    using (MemoryStream ms = new MemoryStream()) {
                        target.Save(ms, ImageFormat.Png);
                        byte[] pngBytes = ms.ToArray();
                        
                        using (FileStream fs = new FileStream("favicon.ico", FileMode.Create, FileAccess.Write)) {
                            // ICO File Header (6 bytes)
                            fs.WriteByte(0); fs.WriteByte(0); // Reserved. Must always be 0.
                            fs.WriteByte(1); fs.WriteByte(0); // Spec type: 1 = Icon
                            fs.WriteByte(1); fs.WriteByte(0); // Number of images in file: 1

                            // Icon Directory Entry (16 bytes)
                            fs.WriteByte(0);                  // Width: 256 pixels (represented as 0)
                            fs.WriteByte(0);                  // Height: 256 pixels (represented as 0)
                            fs.WriteByte(0);                  // Color palette (0 = no palette)
                            fs.WriteByte(0);                  // Reserved (must be 0)
                            fs.WriteByte(1); fs.WriteByte(0); // Color planes (1)
                            fs.WriteByte(32); fs.WriteByte(0); // Bits per pixel (32-bit pixel depth)
                            
                            // Image/PNG Data Size (4 bytes)
                            byte[] sizeBytes = BitConverter.GetBytes(pngBytes.Length);
                            fs.Write(sizeBytes, 0, 4);
                            
                            // Image/PNG Data Offset (4 bytes) -> Header (6) + Directory Entry (16) = 22
                            byte[] offsetBytes = BitConverter.GetBytes(22);
                            fs.Write(offsetBytes, 0, 4);
                            
                            // Write actual image data payload
                            fs.Write(pngBytes, 0, pngBytes.Length);
                        }
                    }
                }
            }
            Console.WriteLine("SUCCESS: Windows desktop-grade ICO compiled perfectly!");
        } catch (Exception ex) {
            Console.WriteLine("CRITICAL EXCEPTION compiling icon: " + ex.ToString());
        }
    }
}
