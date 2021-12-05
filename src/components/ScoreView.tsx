import React from 'react';

import Score from '../types/Score';
import PerformanceIndicator from './PerformanceIndicator';

type ScoreViewProps = {
  score: Score,
  title?: string,
};

function ScoreView({
  score: {
    lettersTyped,
    milliseconds,
    totalErrors,
    performance,
  },
  title,
}: ScoreViewProps) {
  // Beautify for user readability
  const lettersTypedReadable: number = Math.round(lettersTyped);
  const typingSpeedReadable: number = (milliseconds === 0) ? 0 : Math.round(lettersTyped / (milliseconds / 1000) * 100) / 100;
  const totalErrorsReadable: number = Math.round(totalErrors);

  function getTitle(): React.ReactElement | null {
    if (title === null) {
      return null;
    }

    return <div className="title">{title}</div>;
  }
  
  function getPerformanceIcon(): React.ReactElement | null {
    if (performance === undefined) {
      return null;
    }

    return <PerformanceIndicator performance={performance} />;
  }

  return (
    <div className="ScoreView">
      {getTitle()}
      <div className="lettersTyped">Letters typed: {lettersTypedReadable}</div>
      <div className="typingSpeed">
        Typing speed: {typingSpeedReadable}
        {getPerformanceIcon()}
      </div>
      <div className="totalErrors">Errors made: {totalErrorsReadable}</div>
    </div>
  );
}

export default ScoreView;
