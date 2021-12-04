import React, { useEffect, useState } from 'react';
import Score from '../types/Score';
import ScoreView from './ScoreView';
import useInterval from './useInterval';

function App() {
  const [definitions, setDefinitions] = useState<string[]>([]);
  useEffect(() => {
    async function fillDefinitions() {
      for (let i = 0; i <= 36; i += 1) {
        const definitionsBatchModule = await import(`../definitions/batch${i}.ts`);
        const newDefinitions = definitionsBatchModule.default as string[];

        setDefinitions((oldDefinitions) => [...oldDefinitions, ...newDefinitions]);
      }
    }
    fillDefinitions();
  }, []);


  const [scores, setScores] = useState<Score[]>(getSavedScores());
  useEffect(() => {
    const saveScores = () => {
      localStorage.setItem('scores', JSON.stringify(scores));
    }

    window.addEventListener('beforeunload', saveScores);
    return () => window.removeEventListener('beforeunload', saveScores);
  }, [scores]);

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
      setScores((prevScores: Score[]) => {
        const newScore: Score = {
          id: (prevScores.length === 0) ? 0 : prevScores[prevScores.length - 1]!.id + 1,
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
    <div className="App">
      <p className="definition">{curDefinition}</p>
      <textarea value={userInput} onChange={(element) => setUserInput(element.target.value)} />
      <div className={hasError ? 'redBg' : 'whiteBg'}>{hasError ? 'Error found' : 'No errors'}</div>
      <div>Typing speed: {typingSpeed} (typing for {Math.round(typingTime / 100) / 10} seconds)</div>
      <div>Total errors: {totalErrors}</div>
      <div className="scores">
        {scores.slice().reverse().map((score: Score) => <ScoreView score={score} key={score.id} />)}
      </div>
    </div>
  );
}

function getSavedScores(): Score[] {
  const savedScores: string | null = localStorage.getItem('scores');

  if (savedScores === null) {
    return [];
  }

  return JSON.parse(savedScores);
}

export default App;
