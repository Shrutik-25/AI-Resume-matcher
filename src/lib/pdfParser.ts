const pdf = require('pdf-parse');

export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    // Clean up excessive consecutive spaces and empty lines
    const cleanedText = data.text.replace(/\s+/g, ' ').trim();
    return cleanedText;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to extract text from the PDF file.');
  }
}