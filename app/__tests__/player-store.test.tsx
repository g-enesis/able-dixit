import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import PlayerScore from "../components/player-store";
import { useScoreStore } from "../store/scoreStore";

// useScoreStore 훅을 모킹(mocking)
jest.mock("../store/scoreStore", () => ({
  useScoreStore: jest.fn(),
}));

describe("PlayerScore", () => {
  const mockAddScore = jest.fn(); // addScore 함수의 목(mock)
  const mockUpdatePlayerName = jest.fn(); // updatePlayerName 함수의 목(mock)

  // 각 테스트 전에 호출되는 함수, 목(mock) 데이터를 설정
  beforeEach(() => {
    (useScoreStore as unknown as jest.Mock).mockReturnValue({
      addScore: mockAddScore,
      updatePlayerName: mockUpdatePlayerName,
    });
  });

  // 1. player name과 score input 필드를 렌더링하는지 테스트
  it("player name과 score input 필드를 렌더링하는지 테스트", () => {
    render(<PlayerScore playerId={1} name="Player 1" />);

    // player name이 올바르게 렌더링되는지 확인
    expect(screen.getByDisplayValue("Player 1")).toBeInTheDocument();

    // score input 필드(스핀버튼)가 렌더링되는지 확인
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  // 2. '추가' 버튼을 클릭했을 때 유효한 점수가 있으면 addScore 함수가 호출되는지 테스트
  it("'추가' 버튼을 클릭했을 때 유효한 점수가 있으면 addScore 함수가 호출되는지 테스트", () => {
    render(<PlayerScore playerId={1} name="Player 1" />);

    // 점수 입력 필드에 유효한 점수 값을 변경
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "10" },
    });

    // '추가' 버튼 클릭
    fireEvent.click(screen.getByText("추가"));

    // addScore 함수가 playerId와 점수 값을 인자로 호출되는지 확인
    expect(mockAddScore).toHaveBeenCalledWith(1, 10);
    // addScore 함수가 정확히 한 번 호출되었는지 확인
    expect(mockAddScore).toHaveBeenCalledTimes(1);
  });

  // 3. player name을 변경했을 때 updatePlayerName 함수가 호출되는지 테스트
  it("player name을 변경했을 때 updatePlayerName 함수가 호출되는지 테스트", () => {
    render(<PlayerScore playerId={1} name="Player 1" />);

    // player name을 변경
    fireEvent.change(screen.getByDisplayValue("Player 1"), {
      target: { value: "Player 2" },
    });

    // updatePlayerName 함수가 playerId와 새 이름을 인자로 호출되는지 확인
    expect(mockUpdatePlayerName).toHaveBeenCalledWith(1, "Player 2");
    // updatePlayerName 함수가 정확히 한 번 호출되었는지 확인
    expect(mockUpdatePlayerName).toHaveBeenCalledTimes(1);
  });
});
