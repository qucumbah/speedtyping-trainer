import React, { useEffect, useState } from 'react';

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

  const [curWord, setCurWord] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  useEffect(() => {
    if (words.length === 0) {
      return;
    }

    if (text.length === 0) {
      setStartTime(Date.now());
    }

    if (text !== curWord && curWord !== null) {
      return;
    }

    const randomWord: string = words[Math.floor(Math.random() * words.length)] as string;
    setCurWord(randomWord);

    console.log(randomWord);

    setText('');
    setStartTime(Date.now());
  }, [text, curWord, words]);

  const [hasError, setHasError] = useState<boolean>(false);
  useEffect(() => {
    if (curWord === null) {
      return;
    }

    setHasError(!curWord.startsWith(text));
  }, [text, curWord]);

  const typingTime: number = Date.now() - startTime;
  const lettersTyped: number = text.length;
  const typingSpeed: number = Math.round(lettersTyped / (typingTime / 1000) * 100) / 100;

  return (
    <div>
      <p>{curWord?.replace('\n', '\\n')}</p>
      <textarea value={text} onChange={(element) => setText(element.target.value)} />
      <div className={hasError ? 'redBg' : 'whiteBg'}>{hasError ? 'Error found' : 'No errors'}</div>
      <div>Typing speed: {isNaN(typingSpeed) ? 0 : typingSpeed}</div>
    </div>
  );
}

export default App;
