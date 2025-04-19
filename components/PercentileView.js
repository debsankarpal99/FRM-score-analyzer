import React from 'react';

// Helper function to generate points for a bell curve
function generateBellCurvePoints(mean = 50, stdDev = 15, numPoints = 100) {
  const points = [];
  const min = mean - 3 * stdDev;
  const max = mean + 3 * stdDev;
  const step = (max - min) / numPoints;
  
  for (let x = min; x <= max; x += step) {
    const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
    const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
    points.push({ x, y });
  }
  
  return points;
}

export default function PercentileView({ subject, percentileData }) {
  const { min, max } = percentileData;
  const bellCurvePoints = generateBellCurvePoints();
  
  // Get the maximum y value for scaling
  const maxY = Math.max(...bellCurvePoints.map(p => p.y));
  
  // Scale points for SVG display
  const width = 400;
  const height = 200;
  const padding = 20;
  
  const scaledPoints = bellCurvePoints.map(point => ({
    x: padding + ((point.x - bellCurvePoints[0].x) / (bellCurvePoints[bellCurvePoints.length - 1].x - bellCurvePoints[0].x)) * (width - 2 * padding),
    y: height - padding - (point.y / maxY) * (height - 2 * padding)
  }));
  
  // Generate SVG path command from points
  const pathCommand = scaledPoints.reduce(
    (command, point, i) => 
      command + `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y} `,
    ''
  );
  
  // Calculate position for percentile range markers
  const percentileToX = (percentile) => {
    return padding + (percentile / 100) * (width - 2 * padding);
  };
  
  const minX = percentileToX(min);
  const maxX = percentileToX(max);
  
  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2">{subject}</h3>
      <p className="text-sm text-gray-600 mb-4">
        Percentile Range: {min} - {max} ({percentileData.performanceLevel})
      </p>
      
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {/* Draw bell curve */}
        <path d={pathCommand} fill="none" stroke="#4299e1" strokeWidth="2" />
        
        {/* Fill the area under the curve for this percentile range */}
        <path 
          d={`
            ${pathCommand} 
            L ${maxX} ${height - padding} 
            L ${minX} ${height - padding} 
            Z
          `} 
          fill="rgba(66, 153, 225, 0.2)" 
        />
        
        {/* Draw quartile markers */}
        {[25, 50, 75].map((quartile) => (
          <React.Fragment key={quartile}>
            <line 
              x1={percentileToX(quartile)} 
              y1={padding} 
              x2={percentileToX(quartile)} 
              y2={height - padding} 
              stroke="#a0aec0" 
              strokeWidth="1" 
              strokeDasharray="4" 
            />
            <text 
              x={percentileToX(quartile)} 
              y={height - 5} 
              textAnchor="middle" 
              fontSize="10" 
              fill="#4a5568"
            >
              {quartile}
            </text>
          </React.Fragment>
        ))}
        
        {/* Draw percentile range markers */}
        <line 
          x1={minX} 
          y1={padding} 
          x2={minX} 
          y2={height - padding} 
          stroke="#2b6cb0" 
          strokeWidth="2" 
        />
        <line 
          x1={maxX} 
          y1={padding} 
          x2={maxX} 
          y2={height - padding} 
          stroke="#2b6cb0" 
          strokeWidth="2" 
        />
        
        {/* Labels */}
        <text 
          x={width / 2} 
          y={height - 5} 
          textAnchor="middle" 
          fontSize="12" 
          fill="#2d3748"
        >
          Percentile
        </text>
        <text 
          transform={`rotate(-90, 10, ${height/2})`}
          x="10" 
          y={height/2} 
          textAnchor="middle" 
          fontSize="12" 
          fill="#2d3748"
        >
          Frequency
        </text>
      </svg>
    </div>
  );
}
