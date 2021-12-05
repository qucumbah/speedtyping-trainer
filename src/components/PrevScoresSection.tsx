import React from 'react';

import Score from '../types/Score';
import ScoreView from './ScoreView';

type PrevScoresSectionProps = {
  scores: Score[],
  showPrevScores: boolean,
};

function PrevScoresSection(props: PrevScoresSectionProps) {
  return (
    <div className="PrevScoresSection" hidden={!props.showPrevScores}>
      <p>Prevoius scores:</p>
      {props.scores.slice().reverse().map((score: Score) => <ScoreView score={score} key={score.id} />)}
    </div>
  );
}

export default PrevScoresSection;
