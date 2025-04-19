import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileUpload({ onProcessFile }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to process file');
      }
      
      const data = await response.json();
      onProcessFile(data);
    } catch (err) {
      console.error('Error processing file:', err);
      setError('Failed to process the file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [onProcessFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        {...getRootProps()} 
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="text-center">
            <svg className="animate-spin h-8 w-8 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2">Processing your file...</p>
          </div>
        ) : (
          <div>
            <img 
              src="/api/placeholder/64/64" 
              alt="Upload" 
              className="mx-auto mb-4" 
            />
            {isDragActive ? (
              <p className="text-blue-500">Drop the file here...</p>
            ) : (
              <>
                <p className="text-gray-700">Drag & drop your FRM result PDF or image here</p>
                <p className="text-gray-500 text-sm mt-2">or click to select a file</p>
              </>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Supported formats: PDF, JPG, PNG
      </div>
    </div>
  );
}
