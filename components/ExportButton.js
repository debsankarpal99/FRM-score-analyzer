import { useState } from 'react';
import Papa from 'papaparse';

export default function ExportButton({ data }) {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = () => {
    setIsExporting(true);
    
    try {
      // Format data for CSV
      const { candidateInfo, results } = data;
      
      const csvData = [
        ['FRM Exam Results'],
        [''],
        ['Candidate Information'],
        ['Name', candidateInfo.name],
        ['GARP ID', candidateInfo.garpId],
        ['Exam Date', candidateInfo.examDate],
        [''],
        ['Subject Results'],
        ['Subject', 'Min Percentile', 'Max Percentile', 'Performance Level']
      ];
      
      // Add results for each subject
      Object.entries(results).forEach(([subject, data]) => {
        csvData.push([
          subject,
          data.percentile.min,
          data.percentile.max,
          data.performanceLevel
        ]);
      });
      
      // Convert to CSV
      const csv = Papa.unparse(csvData);
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `FRM_Results_${candidateInfo.name.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
    >
      {isExporting ? 'Exporting...' : 'Export to CSV'}
    </button>
  );
}
