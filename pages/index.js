import { useState } from 'react';
import Head from 'next/head';
import FileUpload from '../components/FileUpload';
import ResultsDisplay from '../components/ResultsDisplay';

export default function Home() {
  const [resultData, setResultData] = useState(null);

  const handleProcessedFile = (data) => {
    setResultData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Head>
        <title>FRM Result Analyzer</title>
        <meta name="description" content="Upload and analyze your FRM exam results" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          FRM Result Analyzer
        </h1>
        
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Upload Your FRM Result</h2>
            <FileUpload onProcessFile={handleProcessedFile} />
          </div>
        </div>
        
        {resultData && <ResultsDisplay data={resultData} />}
        
        {!resultData && (
          <div className="max-w-2xl mx-auto text-center p-8">
            <p className="text-gray-600">
              Upload your FRM exam result PDF or image to visualize your performance and generate analysis charts.
            </p>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>FRM Result Analyzer © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
