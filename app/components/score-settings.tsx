"use client";

import { useState } from "react";
import { useScoreStore } from "../store/scoreStore";

/**
 * @author 김기원
 * @description 규칙 세팅 입력, 수정 폼
 */
const ScoreSettings = () => {
  const { scoringRules, winningScore: wnScore, updateScoringRules, updateWinningScore } = useScoreStore();

  const [winningScore, setWinningScore] = useState<number>(wnScore);
  const [newRules, setNewRules] = useState(scoringRules);

  const onChangeRules = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setNewRules(prev => ({ ...prev, [name]: Number(value) }));
  };

  const onChangeWinningScore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 입력 가능하게 필터링

    const numericValue = Number(value);
    setWinningScore(numericValue);
    updateWinningScore(numericValue);
  };

  const onClickUpdateRules = () => {
    updateScoringRules(newRules);
    alert("점수 룰이 업데이트되었습니다!");
  };

  return (
    <>
      <div className="p-4 bg-[#F3F4F6] rounded-[3px] mt-4">
        <h3 className="text-md font-[600] mb-2 leading-5 text-black">점수 설정</h3>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center">
            <span className="w-32 text-sm text-[#333333] leading-[18px]">정답 점수:</span>
            <input
              type="text"
              name="correctGuess"
              value={String(newRules?.correctGuess) ?? "0"}
              onChange={onChangeRules}
              className="border-[1px] p-1 w-full text-black text-base focus:outline-none border-[#D1D1D1]"
            />
          </label>
          <label className="flex items-center">
            <span className="w-32 text-sm text-[#333333] leading-[18px]">부분 정답:</span>
            <input
              type="text"
              name="partialGuess"
              value={String(newRules?.partialGuess) ?? "0"}
              onChange={onChangeRules}
              className="border-[1px] p-1 w-full text-black text-base focus:outline-none border-[#D1D1D1]"
            />
          </label>
          <label className="flex items-center">
            <span className="w-32 text-sm text-[#333333] leading-[18px]">오답 점수:</span>
            <input
              type="text"
              name="incorrectGuess"
              value={String(newRules?.incorrectGuess) ?? "0"}
              onChange={onChangeRules}
              className="border-[1px] p-1 w-full text-black text-base focus:outline-none border-[#D1D1D1]"
            />
          </label>
        </div>

        <button
          onClick={onClickUpdateRules}
          className="mt-3 bg-[#3668D7] text-white font-semibold px-3 py-2 rounded hover:bg-blue-700 w-full"
        >
          적용
        </button>
      </div>

      <div className="mt-5 p-4 bg-[#F3F4F6] rounded-[3px]">
        <h3 className="text-md font-semibold mb-2 leading-5 text-black">게임 설정</h3>
        <div className="flex items-center gap-2">
          <label htmlFor="winningScore" className="text-sm text-[#333333] leading-4">
            승리 점수:
          </label>
          <input
            type="text"
            id="winningScore"
            value={String(winningScore) || ""}
            onChange={onChangeWinningScore}
            className="w-20 border-[1px] p-1 text-black text-base focus:outline-none border-[#D1D1D1]"
          />
        </div>
        <span className="text-[#DD1A11] text-[14px] leading-4 font-normal">
          * 승리 점수는 변경 시 자동으로 적용됩니다.
        </span>
      </div>
    </>
  );
};

export default ScoreSettings;
