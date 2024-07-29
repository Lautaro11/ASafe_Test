import { Buffer } from 'buffer';

// Function to determine MIME type from Base64 string
export const getMimeTypeFromBase64 = async (base64String: string): Promise<string | null> => {
  // Decode Base64 string to binary data
  const base64Data = base64String.split(';base64,').pop()!;
  const binaryData = Buffer.from(base64Data, 'base64');

  // Dynamically import the 'file-type' module
  const { fileTypeFromBuffer } = await import('file-type');

  // Detect MIME type from binary data
  const fileTypeResult = await fileTypeFromBuffer(binaryData);

  return fileTypeResult?.mime || null;
};
