import React from 'react';

import Score from '../types/Score';
import ScoreView from './ScoreView';

type UsefulScoresSubsectionProps = {
  currentScore: Score,
  lastScore: Score,
  averageScore: Score,
};

function UsefulScoresSubsection({
  currentScore,
  lastScore,
  averageScore,
}: UsefulScoresSubsectionProps) {
  return (
    <div className="UsefulScoresSubsection">
      <ScoreView title={"Current score"} score={currentScore} />
      <ScoreView title={"Last score"} score={lastScore} />
      <ScoreView title={"Average score"} score={averageScore} />
    </div>
  );
}

export default UsefulScoresSubsection;
