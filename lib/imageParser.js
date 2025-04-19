import Tesseract from 'tesseract.js';

export async function extractTextFromImage(imageBuffer) {
  try {
    const { data } = await Tesseract.recognize(
      imageBuffer,
      'eng',
      { logger: m => console.log(m) }
    );
    return data.text;
  } catch (error) {
    console.error('Error parsing Image:', error);
    throw new Error('Failed to parse image file');
  }
}
