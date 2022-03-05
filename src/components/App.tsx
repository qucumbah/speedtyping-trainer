import React, { useEffect, useState } from 'react';
import Score from '../types/Score';
import ScorePerformance from '../types/ScorePerformance';
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

  function addNewScore(newScore: Score) {
    setScores((prevScores: Score[]) => {
      newScore.id = (prevScores.length === 0) ? 0 : prevScores[prevScores.length - 1]!.id! + 1;
      return [...prevScores, newScore];
    });;
  }

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

  function getLastScore(): Score {
    const result: Score = Object.assign({}, scores[scores.length - 1]!);
    result.performance = getPerformance(result);
    return result;
  }

  function getPerformance(curScore: Score): ScorePerformance {
    const [speedSum, maxSpeed]: [number, number] = scores.reduce(
      ([speedSum, maxSpeed], otherScore) => {
        if (otherScore.id === curScore.id) {
          return [speedSum, maxSpeed];
        }
        const otherScoreSpeed: number = otherScore.lettersTyped / otherScore.milliseconds;
        return [speedSum + otherScoreSpeed, Math.max(maxSpeed, otherScoreSpeed)];
      },
      [0, 0],
    );

    const curScoreSpeed = curScore.lettersTyped / curScore.milliseconds;
    const averageSpeed = speedSum / (scores.length - 1);

    console.log(curScoreSpeed, averageSpeed, speedSum, maxSpeed);

    if (curScoreSpeed > maxSpeed) {
      return 'personal best';
    } else if (curScoreSpeed > averageSpeed) {
      return 'better than average';
    } else if (curScoreSpeed === averageSpeed) {
      return 'average';
    } else {
      return 'worse than average';
    }
  }

  const [isMinimal, setIsMinimal] = useState<boolean>(false);

  return (
    <div className="App">
      <MainSection
        averageScore={(scores.length === 0) ? getEmptyScore() : getAverageScore()}
        lastScore={(scores.length === 0) ? getEmptyScore() : getLastScore()}
        definitions={definitions}
        onNewScore={addNewScore}
        isMinimal={isMinimal}
        onSetIsMinimal={setIsMinimal}
      />
      {isMinimal ? null : <PrevScoresSection scores={scores} onResetScores={resetScores} />}
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
