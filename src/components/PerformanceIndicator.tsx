import React from 'react';
import ScorePerformance from '../types/ScorePerformance';

type PerformanceIndicatorProps = {
  performance: ScorePerformance,
};

function PerformanceIndicator({ performance }: PerformanceIndicatorProps) {
  if (performance === null || performance === 'average') {
    return null;
  }

  let iconPath: string;
  let subtitle: string;
  switch (performance) {
    case 'worse than average':
      iconPath = 'icons/arrow_downward_black_24dp.svg';
      subtitle = 'Worse than average';
      break;
    case 'better than average':
      iconPath = 'icons/arrow_upward_black_24dp.svg';
      subtitle = 'Better than average';
      break;
    case 'personal best':
      iconPath = 'icons/local_fire_department_black_24dp.svg';
      subtitle = 'Personal best';
      break;
  }

  return (
    <div className="PerformanceIndicator" title={subtitle}>
      <img src={iconPath} draggable="false" />
    </div>
  );
}

export default PerformanceIndicator;
