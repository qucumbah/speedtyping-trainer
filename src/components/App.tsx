import React, { useEffect, useState } from 'react';
import Score from '../types/Score';
import MainSection from './MainSection';
import PrevScoresSection from './PrevScoresSection';

function App() {
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

  const [scores, setScores] = useState<Score[]>(getSavedScores());
  useEffect(() => {
    const saveScores = () => {
      localStorage.setItem('scores', JSON.stringify(scores));
    }

    window.addEventListener('beforeunload', saveScores);
    return () => window.removeEventListener('beforeunload', saveScores);
  }, [scores]);

  function resetScores(): void {
    const userPermission: boolean = confirm('Are you sure you want to reset all scores? This cannot be undone.');
    if (userPermission) {
      setScores([]);
    }
  }

  function getAverageScore(): Score {
    const summedScores: Score = scores.reduce((summedScores: Score, currentScore: Score) => {
      return {
        lettersTyped: summedScores.lettersTyped + currentScore.lettersTyped,
        milliseconds: summedScores.milliseconds + currentScore.milliseconds,
        totalErrors: summedScores.totalErrors + currentScore.totalErrors,
      };
    }, getEmptyScore());

    return {
      lettersTyped: summedScores.lettersTyped / scores.length,
      milliseconds: summedScores.milliseconds / scores.length,
      totalErrors: summedScores.totalErrors / scores.length,
    };
  }

  function getEmptyScore(): Score {
    return {
      lettersTyped: 0,
      milliseconds: 0,
      totalErrors: 0,
    };
  }

  const [showScores, setShowScores] = useState<boolean>(true);

  return (
    <div className="App">
      <MainSection
        averageScore={(scores.length === 0) ? getEmptyScore() : getAverageScore()}
        lastScore={(scores.length === 0) ? getEmptyScore() : scores[scores.length - 1]!}
        definitions={definitions}
        onSetScores={setScores}
        onSetShowScores={setShowScores}
      />
      <PrevScoresSection scores={scores} onResetScores={resetScores} showPrevScores={showScores} />
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
