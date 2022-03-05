import React, { useState } from 'react';
import useDefinitions from '../hooks/useDefinitions';
import useScores from '../hooks/useScores';
import Score from '../types/Score';
import ScorePerformance from '../types/ScorePerformance';
import MainSection from './MainSection';
import PrevScoresSection from './PrevScoresSection';

function App() {
  const definitions = useDefinitions();

  const [scores, addNewScore, resetScores] = useScores();

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

export default App;
