import React, { useEffect, useState } from 'react';
import Score from '../types/Score';

import ScoreView from './ScoreView';
import useInterval from './useInterval';

type MainSectionProps = {
  definitions: string[],
  onSetScores: (setter: (prevValue: Score[]) => Score[]) => void,
  onSetShowScores: (setter: (prevValue: boolean) => boolean) => void,
  onResetScores: () => void,
  averageScore: Score,
};

function MainSection({
  definitions,
  onSetScores,
  onSetShowScores,
  onResetScores,
  averageScore,
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

  const lettersTyped: number = userInput.length;
  const typingSpeed: number = (typingTime === 0) ? 0 : Math.round(lettersTyped / (typingTime / 1000) * 100) / 100;

  return (
    <div className="MainSection">
      <p className="definition">{curDefinition}</p>
      <textarea value={userInput} onChange={(element) => setUserInput(element.target.value)} />
      <div className={hasError ? 'redBg' : 'whiteBg'}>{hasError ? 'Error found' : 'No errors'}</div>
      <div>Typing speed: {typingSpeed} (typing for {Math.round(typingTime / 100) / 10} seconds)</div>
      <div>Errors made: {totalErrors}</div>
      <input type="button" value="Toggle scores" onClick={() => onSetShowScores((prevShowScores) => !prevShowScores)} />
      <input type="button" value="Reset scores" onClick={onResetScores} />
      <div className="averageScore">
        <p>Average score:</p>
        <ScoreView score={averageScore} />
      </div>
    </div>
  );
}

export default MainSection;
