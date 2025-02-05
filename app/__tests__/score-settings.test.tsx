import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ScoreSettings from "../components/score-settings";
import { useScoreStore } from "../store/scoreStore";

// useScoreStore 훅을 모킹(mocking)
jest.mock("../store/scoreStore", () => ({
  useScoreStore: jest.fn(),
}));

describe("ScoreSettings", () => {
  const mockUpdateScoringRules = jest.fn(); // updateScoringRules 함수 모킹
  const mockUpdateWinningScore = jest.fn(); // updateWinningScore 함수 모킹

  // 각 테스트 전에 호출되는 함수, 초기 상태와 목(mock) 데이터를 설정
  beforeEach(() => {
    (useScoreStore as unknown as jest.Mock).mockReturnValue({
      scoringRules: {
        correctGuess: 10,
        partialGuess: 5,
        incorrectGuess: -5,
      },
      winningScore: 30,
      updateScoringRules: mockUpdateScoringRules,
      updateWinningScore: mockUpdateWinningScore,
    });

    // alert을 모킹(mock) 처리하여 호출 여부를 추적
    global.alert = jest.fn();
  });

  // afterEach: 각 테스트 후 모킹된 함수들을 초기화
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. 점수 규칙과 승리 점수가 올바르게 렌더링되는지 테스트
  test("채점 규칙 및 승리 점수를 렌더링한다.", () => {
    render(<ScoreSettings />);

    // '정답 점수', '부분 정답', '오답 점수', '승리 점수' 입력 필드가 올바르게 표시되는지 확인
    expect(screen.getByLabelText(/정답 점수/)).toHaveValue("10");
    expect(screen.getByLabelText(/부분 정답/)).toHaveValue("5");
    expect(screen.getByLabelText(/오답 점수/)).toHaveValue("-5");
    expect(screen.getByLabelText(/승리 점수/)).toHaveValue("30");
  });

  // 2. 점수 입력 필드 값이 변경될 때 상태가 업데이트되는지 테스트
  test("입력 변경 시 newRules 상태를 업데이트한다.", () => {
    render(<ScoreSettings />);

    const correctGuessInput = screen.getByLabelText(/정답 점수/);

    // '정답 점수' 입력 값 변경 후, blur 이벤트 발생
    fireEvent.change(correctGuessInput, { target: { value: "15" } });
    fireEvent.blur(correctGuessInput);

    // 값이 올바르게 변경되었는지 확인
    expect(correctGuessInput).toHaveValue("15");
  });

  // 3. 승리 점수 입력 값이 변경될 때 상태가 업데이트되는지 테스트
  test("입력 변경 시 WinningScore 상태를 업데이트한다.", () => {
    render(<ScoreSettings />);

    const winningScoreInput = screen.getByLabelText(/승리 점수/);

    // '승리 점수' 입력 값 변경 후, blur 이벤트 발생
    fireEvent.change(winningScoreInput, { target: { value: "40" } });
    fireEvent.blur(winningScoreInput);

    // 값이 올바르게 변경되었는지 확인
    expect(winningScoreInput).toHaveValue("40");
  });

  // 4. '적용' 버튼 클릭 시 updateScoringRules가 호출되는지 테스트
  test("'적용' 버튼을 클릭하면 updateScoringRules를 호출한다.", async () => {
    render(<ScoreSettings />);

    // 정답 점수 값을 변경
    fireEvent.change(screen.getByLabelText(/정답 점수/), { target: { value: "15" } });

    // '적용' 버튼 클릭
    fireEvent.click(screen.getByRole("button", { name: /적용/i }));

    // 'updateScoringRules'가 올바른 인자와 함께 호출되는지 확인
    await waitFor(() =>
      expect(mockUpdateScoringRules).toHaveBeenCalledWith({
        correctGuess: 15,
        partialGuess: 5,
        incorrectGuess: -5,
      }),
    );

    // 점수 룰이 업데이트되었음을 알리는 alert이 호출되었는지 검증
    expect(global.alert).toHaveBeenCalledWith("점수 룰이 업데이트되었습니다!");
  });

  // 6. 승리 점수 입력 시 숫자만 입력되고, 빈 값 0으로 설정되는지 테스트
  test("승리 점수 입력 시 숫자만 입력되며, 빈 값 입력 시 0으로 설정된다.", () => {
    render(<ScoreSettings />);

    const winningScoreInput = screen.getByLabelText(/승리 점수/);

    // 숫자가 아닌 값 입력 시 0으로 변경되는지 검증
    fireEvent.change(winningScoreInput, { target: { value: "abc" } });
    expect(winningScoreInput).toHaveValue("0"); // 기대값을 "0"으로 변경

    // 빈 문자열 입력 후 포커스 아웃 시 0으로 설정되는지 검증
    fireEvent.change(winningScoreInput, { target: { value: "" } });
    fireEvent.blur(winningScoreInput);
    expect(winningScoreInput).toHaveValue("0");
  });
});
