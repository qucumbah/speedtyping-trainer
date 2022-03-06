import { useState, useEffect } from 'react';
import Score, { getEmptyScore } from '../types/Score';
import ScorePerformance from '../types/ScorePerformance';

export default function useScores() {
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      newScore.id = (prevScores.length === 0) ? 0 : prevScores[prevScores.length - 1]!.id! + 1;
      return [...prevScores, newScore];
    });
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

  function getLastScore(): Score {
    const lastScore: Score | undefined = scores[scores.length - 1];

    if (lastScore === undefined) {
      throw new Error('Could not find last score');
    }

    const result: Score = Object.assign({}, lastScore);
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

  return [
    scores,
    addNewScore,
    resetScores,
    getAverageScore,
    getLastScore,
  ] as [
    Score[],
    (newScore: Score) => void,
    () => void,
    () => Score,
    () => Score,
  ];
}

function getSavedScores(): Score[] {
  const savedScores: string | null = localStorage.getItem('scores');

  if (savedScores === null) {
    return [];
  }

  return JSON.parse(savedScores);
}
