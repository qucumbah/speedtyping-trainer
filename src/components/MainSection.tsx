import React, { useEffect, useState } from 'react';
import Score from '../types/Score';

import ScoreView from './ScoreView';
import useInterval from './useInterval';

type MainSectionProps = {
  definitions: string[],
  onSetScores: (setter: (prevValue: Score[]) => Score[]) => void,
  onSetShowScores: (setter: (prevValue: boolean) => boolean) => void,
  averageScore: Score,
  lastScore: Score,
};

function MainSection({
  definitions,
  onSetScores,
  onSetShowScores,
  averageScore,
  lastScore,
}: MainSectionProps) {
  const [hasStartedTyping, setHasStartedTyping] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [curDefinition, setCurDefinition] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [totalErrors, setTotalErrors] = useState<number>(0);
  useEffect(() => {
    if (definitions.length === 0) {
      return;
    }

    if (userInput.length === 0) {
      setStartTime(Date.now());
      setTotalErrors(0);
      setHasStartedTyping(false);
    } else if (!hasStartedTyping) {
      setStartTime(Date.now());
      setHasStartedTyping(true);
    }

    if (userInput !== curDefinition && curDefinition !== null) {
      return;
    }

    if (curDefinition !== null) {
      onSetScores((prevScores: Score[]) => {
        const newScore: Score = {
          id: (prevScores.length === 0) ? 0 : prevScores[prevScores.length - 1]!.id! + 1,
          lettersTyped: curDefinition.length,
          milliseconds: Date.now() - startTime,
          totalErrors: totalErrors,
        };

        return [...prevScores, newScore];
      });
    }

    const randomDefinition: string = definitions[Math.floor(Math.random() * definitions.length)]!;
    setCurDefinition(randomDefinition);

    setUserInput('');
    setStartTime(Date.now());
    setTotalErrors(0);
  }, [userInput, curDefinition, definitions, startTime, totalErrors]);

  const [hasError, setHasError] = useState<boolean>(false);
  useEffect(() => {
    if (curDefinition === null) {
      return;
    }

    setHasError((prevHasError: boolean) => {
      const newHasError: boolean = !curDefinition.startsWith(userInput);
      if (!prevHasError && newHasError) {
        setTotalErrors((prevTotalErrors: number) => prevTotalErrors + 1);
      }
      return newHasError;
    });
  }, [userInput, curDefinition]);

  const [typingTime, setTypingTime] = useState<number>(Date.now() - startTime);
  useInterval({
    updateFunction: () => {
      setTypingTime(hasStartedTyping ? Date.now() - startTime : 0);
    },
    intervalMs: 100,
    dependencies: [startTime],
  });

  const currentScore: Score = {
    lettersTyped: userInput.length,
    milliseconds: typingTime,
    totalErrors,
  };

  return (
    <div className="MainSection">
      <div className="mainTitle">Speedtyping training</div>
      <div className="centralSection">
        <p className="definition">{curDefinition}</p>
        <label className={`userInputWrapper ${hasError ? 'hasError' : ''}`}>
          <input
            className="userInput"
            placeholder="Type here"
            value={userInput}
            onChange={(element) => setUserInput(element.target.value)}
          />
        </label>
        <div className="usefulScoresSection">
          <ScoreView title={"Current score"} score={currentScore} />
          <ScoreView title={"Last score"} score={lastScore} />
          <ScoreView title={"Average score"} score={averageScore} />
        </div>
      </div>
      <div className="buttons">
        <input type="button" value="Toggle scores" onClick={() => onSetShowScores((prevShowScores) => !prevShowScores)} />
      </div>
    </div>
  );
}

export default MainSection;
