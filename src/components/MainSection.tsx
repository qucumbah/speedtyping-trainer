import React from 'react';

import Score from '../types/Score';
import UsefulScoresSubsection from './UsefulScoresSubsection';

import useMainSectionLogic from '../hooks/useMainSectionLogic';

type MainSectionProps = {
  definitions: string[],
  onNewScore: (score: Score) => void,
  isMinimal: boolean,
  onSetIsMinimal: (setter: (prevValue: boolean) => boolean) => void,
  averageScore: Score,
  lastScore: Score,
};

function MainSection({
  definitions,
  onNewScore,
  isMinimal,
  onSetIsMinimal,
  averageScore,
  lastScore,
}: MainSectionProps) {
  const [currentScore, curDefinition, userInput, setUserInput, hasError] = useMainSectionLogic({
    definitions,
    onNewScore,
  })

  function getUsefulScoresSubsection(): React.ReactElement {
    return (
      <UsefulScoresSubsection
        currentScore={currentScore}
        lastScore={lastScore}
        averageScore={averageScore}
      />
    );
  }

  return (
    <div className="MainSection">
      <h2>Speedtyping training</h2>
      <div className="centralSection">
        <p className="definition">{curDefinition}</p>
        <label className={`userInputWrapper ${hasError ? 'hasError' : ''}`}>
          <input
            className="userInput"
            placeholder="Type here"
            value={userInput}
            spellCheck="false"
            onChange={(element) => setUserInput(element.target.value)}
          />
        </label>
        {isMinimal ? null : getUsefulScoresSubsection()}
      </div>
      <div className="buttons">
        <input
          type="button"
          value="Toggle minimal mode"
          onClick={() => onSetIsMinimal((prevIsMinimal) => !prevIsMinimal)}
        />
      </div>
    </div>
  );
}

export default MainSection;
