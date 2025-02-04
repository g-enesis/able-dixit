"use client";

import { useState } from "react";
import { useScoreStore } from "../store/scoreStore";

interface IPropsPlayerScore {
  playerId: number;
  name: string;
}

/**
 * @author 김기원
 * @description 각 플레이어 점수 입력, 수정 폼
 * @params playerId, name
 */
const PlayerScore = ({ playerId, name }: IPropsPlayerScore) => {
  const [score, setScore] = useState("");
  const [playerName, setPlayerName] = useState(name);

  const { addScore, updatePlayerName } = useScoreStore();

  const onClickAddScore = () => {
    addScore(playerId, parseInt(score, 10));
    setScore("");
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value);
    updatePlayerName(playerId, e.target.value);
  };

  return (
    <div className="flex items-center gap-4 p-2">
      <input
        type="text"
        value={playerName}
        onChange={onChangeName}
        className="w-[153px] h-[36px] text-black text-base border-[1px] p-1 border-[#D1D1D1] font-normal focus:outline-none"
      />
      <input
        type="number"
        value={score}
        onChange={e => setScore(e.target.value)}
        className="w-[82px] h-[36px] border-[1px] p-1 text-base border-[#D1D1D1] font-normal focus:outline-none"
      />
      <button
        onClick={onClickAddScore}
        className={`w-[52px] h-[36px] text-sm text-white px-3 py-1 rounded-sm font-semibold ${
          score.trim() === "" ? "bg-gray-300 cursor-not-allowed" : "bg-[#3668D7] hover:bg-blue-700"
        }`}
        disabled={score.trim() === ""}
      >
        추가
      </button>
    </div>
  );
};

export default PlayerScore;
