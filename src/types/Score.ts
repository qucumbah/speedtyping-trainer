import ScorePerformance from './ScorePerformance';

type Score = {
  id?: number,
  lettersTyped: number,
  milliseconds: number,
  totalErrors: number,
  iterations?: number,
  performance?: ScorePerformance,
}

function getEmptyScore(): Score {
  return {
    lettersTyped: 0,
    milliseconds: 0,
    totalErrors: 0,
  };
}

export {
  Score as default,
  getEmptyScore,
};
