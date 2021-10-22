import React, { useEffect, useState } from 'react';

function App() {
  const [words, setWords] = useState<string[]>([]);

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

  return <div>{words.length}</div>;
}

export default App;
