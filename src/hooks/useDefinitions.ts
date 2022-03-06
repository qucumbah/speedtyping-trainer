import { useState, useEffect } from 'react';

export default function useDefinitions() {
  const [definitions, setDefinitions] = useState<string[]>([]);

  useEffect(() => {
    async function fillDefinitions() {
      for (let i = 0; i <= 35; i += 1) {
        import(`../definitions/batch${i}.ts`)
          .then((definitionsBatchModule) => definitionsBatchModule.default as string[])
          .then((newDefinitions: string[]) => {
            setDefinitions((oldDefinitions) => [...oldDefinitions, ...newDefinitions]);
          });
      }
    }
    fillDefinitions();
  }, []);

  return definitions;
}
