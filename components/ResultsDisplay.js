import ScoreChart from './ScoreChart';
import PercentileView from './PercentileView';
import ExportButton from './ExportButton';

export default function ResultsDisplay({ data }) {
  if (!data) return null;
  
  const { candidateInfo, results } = data;
  
  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4">FRM Exam Results Analysis</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Candidate Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Name</div>
              <div className="font-medium">{candidateInfo.name}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">GARP ID</div>
              <div className="font-medium">{candidateInfo.garpId}</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm text-gray-600">Exam Date</div>
              <div className="font-medium">{candidateInfo.examDate}</div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Overall Performance</h3>
          <ScoreChart results={results} />
          <div className="mt-4 text-right">
            <ExportButton data={data} />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Subject Performance</h3>
          <div className="space-y-6">
            {Object.entries(results).map(([subject, data]) => (
              <PercentileView 
                key={subject} 
                subject={subject} 
                percentileData={data.percentile} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
