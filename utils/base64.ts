import { Paths, File } from "expo-file-system";

export function base64ToArrayBuffer(base64: string): Uint8Array {
  // Remove the data URL prefix if present
  if (base64.startsWith("data:")) {
    base64 = base64.split(",")[1];
  }

  // Decode the Base64 string into a binary string
  const binaryString = atob(base64);

  // Create a new ArrayBuffer with the same length as the binary string
  const len = binaryString.length;
  const bytes = new Uint8Array(new ArrayBuffer(len));

  // Populate the Uint8Array with the character codes from the binary string
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}

export function base64ToFile(base64: string, filename?: string | null): File {
  if (!filename) {
    // Attempt to guess the mime type from the base64 string
    const match = base64.match(/^data:(image\/[a-zA-Z]+);base64,/);
    const ext = match ? match[1].split("/")[1] : "jpg";
    filename = `generated-${Date.now()}.${ext}`;
  }
  const file = new File(Paths.cache, filename);
  file.create({ overwrite: true });
  file.write(base64ToArrayBuffer(base64));
  return file;
}
