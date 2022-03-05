import React, { useState } from 'react';
import useDefinitions from '../hooks/useDefinitions';
import useScores from '../hooks/useScores';
import { getEmptyScore } from '../types/Score';
import MainSection from './MainSection';
import PrevScoresSection from './PrevScoresSection';

function App() {
  const definitions = useDefinitions();

  const [scores, addNewScore, resetScores, getAverageScore, getLastScore] = useScores();

  const [isMinimal, setIsMinimal] = useState<boolean>(false);

  return (
    <div className="App">
      <MainSection
        averageScore={(scores.length === 0) ? getEmptyScore() : getAverageScore()}
        lastScore={(scores.length === 0) ? getEmptyScore() : getLastScore()}
        definitions={definitions}
        onNewScore={addNewScore}
        isMinimal={isMinimal}
        onSetIsMinimal={setIsMinimal}
      />
      {isMinimal ? null : <PrevScoresSection scores={scores} onResetScores={resetScores} />}
    </div>
  );
}

export default App;
