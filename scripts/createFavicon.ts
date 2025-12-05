// Script to convert logo.png to circular and create favicons
import sharp from "sharp";
import fs from "fs";
import path from "path";

async function createCircularFavicon() {
  console.log("🎨 Creating circular logo and favicons...\n");

  const inputPath = "public/assets/images/logo.png";
  const outputDir = "public";

  try {
    // Read original image
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    const size = Math.min(metadata.width || 512, metadata.height || 512);

    console.log(`📐 Original size: ${metadata.width}x${metadata.height}`);
    console.log(`🔄 Creating circular version with size: ${size}x${size}\n`);

    // Create SVG mask for circular effect
    const circularSvg = Buffer.from(
      `<svg><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></svg>`
    );

    // Create circular logo (512x512)
    await sharp(inputPath)
      .resize(size, size, { fit: "cover", position: "center" })
      .composite([
        {
          input: circularSvg,
          blend: "dest-in",
        },
      ])
      .png()
      .toFile("public/assets/images/logo-circular.png");
    console.log("✅ Created logo-circular.png (512x512)");

    // Create favicon sizes
    const sizes = [16, 32, 64, 128, 192, 256];

    for (const s of sizes) {
      await sharp(inputPath)
        .resize(s, s, { fit: "cover", position: "center" })
        .composite([
          {
            input: Buffer.from(
              `<svg><circle cx="${s / 2}" cy="${s / 2}" r="${s / 2}"/></svg>`
            ),
            blend: "dest-in",
          },
        ])
        .png()
        .toFile(path.join(outputDir, `favicon-${s}x${s}.png`));
      console.log(`✅ Created favicon-${s}x${s}.png`);
    }

    // Create ICO format favicon
    await sharp(inputPath)
      .resize(32, 32, { fit: "cover", position: "center" })
      .composite([
        {
          input: Buffer.from(
            `<svg><circle cx="16" cy="16" r="16"/></svg>`
          ),
          blend: "dest-in",
        },
      ])
      .toFormat("png")
      .toFile(path.join(outputDir, "favicon.png"));
    console.log("✅ Created favicon.png (32x32)");

    console.log("\n🎉 All favicons created successfully!\n");
    console.log("📁 Files created:");
    console.log("   • public/assets/images/logo-circular.png");
    console.log("   • public/favicon-*.png (multiple sizes)");
    console.log("   • public/favicon.png");
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

createCircularFavicon()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
