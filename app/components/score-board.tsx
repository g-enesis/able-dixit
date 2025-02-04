"use client";

import { useEffect } from "react";
import { useScoreStore, useScoreStoreWithLocalStorage } from "../store/scoreStore";
import { LogoIcon } from "./icons/logo-icon";
import PlayerScore from "./player-store";
import ScoreSettings from "./score-settings";

/**
 * @author 김기원
 * @description 종합 스코어 점수판
 */
const ScoreBoard = () => {
  const { players, resetScores, winningScore } = useScoreStore();

  useEffect(() => {
    const winner = players.find(p => p.scores.reduce((a, b) => a + b, 0) >= winningScore);
    if (winner) {
      alert(`${winner.name}님이 승리점수 ${winningScore}점을 달성하여 승리했습니다!`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, resetScores]);

  const initialized = useScoreStoreWithLocalStorage();
  if (!initialized) {
    return <div>loading...</div>;
  }
  return (
    <div className="p-6 bg-white shadow-lg max-w-lg mx-auto w-full sm:w-96">
      <div className="flex gap-2 justify-center items-center">
        <LogoIcon />
        <h2 className="text-2xl font-semibold text-center text-[#000000]">Dixit 점수판</h2>
      </div>

      {/* 점수 설정 UI */}
      <ScoreSettings />

      <div className="mt-5">
        <h3 className="ml-3 text-md text-black font-[600] mb-2">점수 기록</h3>
        {players.map(player => (
          <PlayerScore key={player.id} playerId={player.id} name={player.name} />
        ))}
      </div>

      <div className="mt-5">
        <h3 className="ml-3 text-md font-[600] mb-2 text-black">총점</h3>
        <div className="p-4 bg-[#ECF2FF] rounded-[3px]">
          {players.map(player => {
            return (
              <div key={player.id} className="flex items-center gap-4 mb-2">
                <p className="text-md font-medium text-gray-800">{player.name}:</p>
                <span className="text-md font-medium text-gray-800 bg-white pl-3 pr-3 rounded-md">
                  {player.scores.reduce((a, b) => a + b, 0)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={resetScores}
        className="mt-4 w-full font-semibold bg-[#DD524C] text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        점수 초기화
      </button>
    </div>
  );
};

export default ScoreBoard;
