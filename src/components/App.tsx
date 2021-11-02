import React, { useEffect, useState } from 'react';
import Score from '../types/Score';
import ScoreView from './ScoreView';

function App() {
  const [words, setWords] = useState<string[]>([]);
  const [text, setText] = useState<string>('');
  useEffect(() => {
    async function fillWords() {
      for (let i = 0; i < 102; i += 1) {
        const wordsBatchModule = await import(`../words/batch${i}.ts`);
        const newWordsDictionary = wordsBatchModule.default;
        const newWords: string[] = Object.entries(newWordsDictionary)
          .map(([word, description]: [string, any]) => `${word} - ${description}`);

        setWords((oldWords) => [...oldWords, ...newWords]);
      }
    }
    fillWords();
  }, []);

  const [scores, setScores] = useState<Score[]>(getSavedScores());
  useEffect(() => {
    const saveScores = () => {
      localStorage.setItem('scores', JSON.stringify(scores));
    }

    window.addEventListener('beforeunload', saveScores);
    return () => window.removeEventListener('beforeunload', saveScores);
  }, [scores]);

  const [curWord, setCurWord] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [totalErrors, setTotalErrors] = useState<number>(0);
  useEffect(() => {
    if (words.length === 0) {
      return;
    }

    if (text.length === 0) {
      setStartTime(Date.now());
      setTotalErrors(0);
    }

    if (text !== curWord && curWord !== null) {
      return;
    }

    if (curWord !== null) {
      setScores((prevScores: Score[]) => {
        const newScore: Score = {
          id: (prevScores.length === 0) ? 0 : prevScores[prevScores.length - 1]!.id + 1,
          lettersTyped: curWord.length,
          milliseconds: Date.now() - startTime,
          totalErrors: totalErrors,
        };

        console.log(newScore);

        return [...prevScores, newScore];
      });
    }

    const randomWord: string = words[Math.floor(Math.random() * words.length)]!;
    setCurWord(randomWord);

    console.log(randomWord);

    setText('');
    setStartTime(Date.now());
    setTotalErrors(0);
  }, [text, curWord, words, startTime, totalErrors]);

  const [hasError, setHasError] = useState<boolean>(false);
  useEffect(() => {
    if (curWord === null) {
      return;
    }

    setHasError((prevHasError: boolean) => {
      const newHasError: boolean = !curWord.startsWith(text);
      if (!prevHasError && newHasError) {
        setTotalErrors((prevTotalErrors: number) => prevTotalErrors + 1);
      }
      return newHasError;
    });
  }, [text, curWord]);

  const typingTime: number = Date.now() - startTime;
  const lettersTyped: number = text.length;
  const typingSpeed: number = Math.round(lettersTyped / (typingTime / 1000) * 100) / 100;

  return (
    <div className="App">
      <p className="word">{curWord}</p>
      <textarea value={text} onChange={(element) => setText(element.target.value)} />
      <div className={hasError ? 'redBg' : 'whiteBg'}>{hasError ? 'Error found' : 'No errors'}</div>
      <div>Typing speed: {isNaN(typingSpeed) ? 0 : typingSpeed}</div>
      <div>Total errors: {totalErrors}</div>
      <div className="scores">
        {scores.map((score: Score) => <ScoreView score={score} key={score.id} />)}
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
