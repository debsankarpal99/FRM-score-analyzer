export function extractFRMResults(text) {
  // Define patterns to match subject names and percentile ranges
  const subjects = [
    'Foundations of Risk Management',
    'Quantitative Analysis',
    'Financial Markets and Products',
    'Valuation and Risk Models'
  ];
  
  const results = {};
  
  subjects.forEach(subject => {
    // Look for pattern: Subject Name followed by percentile information
    const subjectRegex = new RegExp(`${subject}[\\s\\S]*?You scored in the (\\d+ - \\d+) percentile range`);
    const match = text.match(subjectRegex);
    
    if (match && match[1]) {
      const percentileRange = match[1];
      // Parse the range (e.g., "51 - 75" -> { min: 51, max: 75 })
      const [min, max] = percentileRange.split(' - ').map(num => parseInt(num, 10));
      
      // Determine performance level based on quartile
      let performanceLevel = 'Unknown';
      if (max <= 25) performanceLevel = 'Basic';
      else if (max <= 50) performanceLevel = 'Fair';
      else if (max <= 75) performanceLevel = 'Good';
      else performanceLevel = 'Excellent';
      
      results[subject] = {
        percentile: {
          min,
          max
        },
        midpoint: (min + max) / 2,
        performanceLevel
      };
    }
  });
  
  // Extract candidate information
  const nameMatch = text.match(/([A-Z\s]+)(?=\s*GARP ID)/);
  const garpIdMatch = text.match(/GARP ID:\s*(\d+)/);
  const examDateMatch = text.match(/Exam Date:\s*([A-Za-z]+\s+\d{4})/);
  
  const candidateInfo = {
    name: nameMatch ? nameMatch[0].trim() : 'Unknown',
    garpId: garpIdMatch ? garpIdMatch[1] : 'Unknown',
    examDate: examDateMatch ? examDateMatch[1] : 'Unknown'
  };
  
  return {
    candidateInfo,
    results
  };
}
