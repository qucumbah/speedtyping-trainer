import ScorePerformance from './ScorePerformance';

type Score = {
  id?: number,
  lettersTyped: number,
  milliseconds: number,
  totalErrors: number,
  iterations?: number,
  performance?: ScorePerformance,
}

export default Score;
