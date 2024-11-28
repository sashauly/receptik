import { createWorker } from "tesseract.js";

export const recognizeText = async (imageFile: File): Promise<string> => {
  const worker = await createWorker("eng");

  try {
    const {
      data: { text },
    } = await worker.recognize(imageFile);
    await worker.terminate();
    return text;
  } catch (error) {
    await worker.terminate();
    throw new Error("Failed to recognize text from image");
  }
};
