import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function saveFileToPublic(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Get file extension
  const ext = path.extname(file.name);

  // Generate unique filename
  const filename = `${uuidv4()}${ext}`;

  // Save to public/uploads directory
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filepath = path.join(uploadDir, filename);
  fs.writeFileSync(filepath, buffer);

  // Return the public URL
  return `/uploads/${filename}`;
}
