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
  useEffect(() => {
    if (words.length === 0) {
      return;
    }

    if (text !== curWord && curWord !== null) {
      return;
    }

    console.log('here');

    const randomWord: string = words[Math.floor(Math.random() * words.length)] as string;
    setCurWord(randomWord);
    setText('');
  }, [text, curWord, words]);

  const [hasError, setHasError] = useState<boolean>(false);
  useEffect(() => {
    if (curWord === null) {
      return;
    }

    setHasError(curWord.startsWith(text));
  }, [text, curWord]);

  return (
    <div>
      <p>{curWord?.replace('\n', '\\\n')}</p>
      <textarea value={text} onChange={(element) => setText(element.target.value)} />
      <div>{hasError ? 'No errors' : 'Error found'}</div>
    </div>
  );
}

export default App;
