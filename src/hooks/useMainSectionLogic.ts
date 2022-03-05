import { useEffect, useState } from 'react';

import Score from '../types/Score';
import useInterval from './useInterval';

type UseMainSectionLogicProps = {
  onNewScore: (score: Score) => void,
  definitions: string[],
}

export default function useMainSectionLogic(props: UseMainSectionLogicProps) {
  const [hasStartedTyping, setHasStartedTyping] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [curDefinition, setCurDefinition] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [totalErrors, setTotalErrors] = useState<number>(0);
  useEffect(() => {
    if (props.definitions.length === 0) {
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
      const newScore: Score = {
        lettersTyped: curDefinition.length,
        milliseconds: Date.now() - startTime,
        totalErrors: totalErrors,
      };
      props.onNewScore(newScore);
    }

    const randomDefinition: string = props.definitions[Math.floor(Math.random() * props.definitions.length)]!;
    setCurDefinition(randomDefinition);

    setUserInput('');
    setStartTime(Date.now());
    setTotalErrors(0);
  }, [userInput, curDefinition, props.definitions, startTime, totalErrors]);

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

  return [
    currentScore,
    curDefinition,
    userInput,
    setUserInput,
    hasError,
  ] as [
    Score,
    string | null,
    string,
    (newUserInput: string) => void,
    boolean,
  ];
}
