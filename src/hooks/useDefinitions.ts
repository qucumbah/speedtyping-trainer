import { useState, useEffect } from 'react';

export default function useDefinitions() {
  const [definitions, setDefinitions] = useState<string[]>([]);

  useEffect(() => {
    async function fillDefinitions() {
      for (let i = 0; i <= 35; i += 1) {
        const definitionsBatchModule = await import(`../definitions/batch${i}.ts`);
        const newDefinitions = definitionsBatchModule.default as string[];

        setDefinitions((oldDefinitions) => [...oldDefinitions, ...newDefinitions]);
      }
    }
    fillDefinitions();
  }, []);

  return definitions;
}
