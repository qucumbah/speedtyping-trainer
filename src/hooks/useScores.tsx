import { useState, useEffect } from 'react';
import Score from '../types/Score';

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

  return [scores, addNewScore, resetScores] as [Score[], (newScore: Score) => void, () => void];
}

function getSavedScores(): Score[] {
  const savedScores: string | null = localStorage.getItem('scores');

  if (savedScores === null) {
    return [];
  }

  return JSON.parse(savedScores);
}
