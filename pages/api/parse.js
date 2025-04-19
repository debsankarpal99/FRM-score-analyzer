
import formidable from 'formidable';
import fs from 'fs';
import { extractTextFromPdf } from '../../lib/pdfParser';
import { extractTextFromImage } from '../../lib/imageParser';
import { extractFRMResults } from '../../lib/resultExtractor';

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the incoming form
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });
    
    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(file.filepath);
    
    // Extract text based on file type
    let text;
    const fileType = file.mimetype;
    
    if (fileType === 'application/pdf') {
      text = await extractTextFromPdf(fileBuffer);
    } else if (fileType.startsWith('image/')) {
      text = await extractTextFromImage(fileBuffer);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }
    
    // Extract FRM results
    const results = extractFRMResults(text);
    
    // Clean up temp file
    fs.unlinkSync(file.filepath);
    
    return res.status(200).json(results);
  } catch (error) {
    console.error('Error processing file:', error);
    return res.status(500).json({ error: 'Failed to process file' });
  }
}
