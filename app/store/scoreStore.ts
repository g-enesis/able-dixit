import { useEffect, useState } from "react";
import { create } from "zustand";

interface IStateScore {
  winningScore: number;
  players: { id: number; name: string; scores: number[] }[];
  scoringRules: {
    correctGuess: number;
    partialGuess: number;
    incorrectGuess: number;
  };
  addScore: (playerId: number, score: number) => void;
  resetScores: () => void;
  updateScoringRules: (rules: {
    correctGuess: number;
    partialGuess: number;
    incorrectGuess: number;
  }) => void;
  updatePlayerName: (playerId: number, newName: string) => void;
  updateWinningScore: (score: number) => void;
}

export const useScoreStore = create<IStateScore>(set => ({
  winningScore: 30,
  players: [],
  scoringRules: { correctGuess: 3, partialGuess: 2, incorrectGuess: 0 },
  addScore: (playerId, score) =>
    set(state => {
      const updatedPlayers = state.players.map(p =>
        p.id === playerId ? { ...p, scores: [...p.scores, score] } : p,
      );
      localStorage.setItem("dixitScores", JSON.stringify(updatedPlayers));
      return { players: updatedPlayers };
    }),
  resetScores: () =>
    set(state => {
      const updatedPlayers = state.players.map(p => ({
        ...p,
        scores: [],
      }));
      localStorage.setItem("dixitScores", JSON.stringify(updatedPlayers));
      return { players: updatedPlayers };
    }),
  updateScoringRules: rules =>
    set(() => {
      localStorage.setItem("dixitRules", JSON.stringify(rules));
      return { scoringRules: rules };
    }),
  updatePlayerName: (playerId, newName) =>
    set(state => {
      const updatedPlayers = state.players.map(p =>
        p.id === playerId ? { ...p, name: newName } : p,
      );
      localStorage.setItem("dixitScores", JSON.stringify(updatedPlayers));
      return { players: updatedPlayers };
    }),
  updateWinningScore: score => {
    localStorage.setItem("winningScore", JSON.stringify(score));
    set(() => ({ winningScore: score }));
  },
}));

export const useScoreStoreWithLocalStorage = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const storedScores = localStorage.getItem("dixitScores");
    const storedWinningScore = localStorage.getItem("winningScore");
    const storedScoringRules = localStorage.getItem("dixitRules");

    useScoreStore.setState({
      players: storedScores
        ? JSON.parse(storedScores)
        : [
            { id: 1, name: "Player 1", scores: [] },
            { id: 2, name: "Player 2", scores: [] },
            { id: 3, name: "Player 3", scores: [] },
            { id: 4, name: "Player 4", scores: [] },
          ],
      winningScore: storedWinningScore ? JSON.parse(storedWinningScore) : 30,
      scoringRules: storedScoringRules
        ? JSON.parse(storedScoringRules)
        : { correctGuess: 3, partialGuess: 2, incorrectGuess: 0 },
    });

    setInitialized(true);
  }, []);

  return initialized;
};
