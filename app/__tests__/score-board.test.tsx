import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import ScoreBoard from "../components/score-board";
import { useScoreStore, useScoreStoreWithLocalStorage } from "../store/scoreStore";

// useScoreStore와 useScoreStoreWithLocalStorage 훅을 모킹(mocking)
jest.mock("../store/scoreStore", () => ({
  useScoreStore: jest.fn(),
  useScoreStoreWithLocalStorage: jest.fn(),
}));

describe("ScoreBoard", () => {
  const mockResetScores = jest.fn(); // resetScores 함수의 목(mock)

  // 각 테스트 전에 호출되는 함수, 목(mock) 데이터를 설정
  beforeEach(() => {
    (useScoreStore as unknown as jest.Mock).mockReturnValue({
      players: [
        { id: 1, name: "Player 1", scores: [5, 6] },
        { id: 2, name: "Player 2", scores: [3, 4] },
      ],
      resetScores: mockResetScores,
      winningScore: 10,
    });

    // useScoreStoreWithLocalStorage를 true로 설정하여 로컬 스토리지를 사용할 경우
    (useScoreStoreWithLocalStorage as jest.Mock).mockReturnValue(true);

    // alert을 모킹(mock) 처리하여 호출 여부를 추적
    global.alert = jest.fn();
  });

  // afterEach: 각 테스트 후 모킹된 함수들을 초기화
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. 플레이어 이름과 총 점수를 렌더링하는지 테스트
  it("플레이어 이름과 총 점수를 렌더링한다", () => {
    render(<ScoreBoard />);

    // player1과 player2의 이름이 올바르게 렌더링되는지 확인
    expect(screen.getByText("Player 1:")).toBeInTheDocument();
    expect(screen.getByText("Player 2:")).toBeInTheDocument();

    // player1과 player2의 총 점수가 올바르게 렌더링되는지 확인
    expect(screen.getByText("11")).toBeInTheDocument(); // 3+4+4 = 11
    expect(screen.getByText("7")).toBeInTheDocument(); // 2+5 = 7
  });

  // 2. 플레이어가 승리 점수에 도달하면 alert을 표시하는지 테스트
  it("플레이어가 승리 점수에 도달하면 alert을 표시한다", () => {
    render(<ScoreBoard />);

    // Player 1이 승리 점수인 10점을 달성하였으므로 alert이 호출되어야 함
    expect(global.alert).toHaveBeenCalledWith("Player 1님이 승리점수 10점을 달성하여 승리했습니다!");
  });

  // 3. 초기화 버튼 클릭 시 resetScores가 호출되는지 테스트
  it("초기화 버튼 클릭 시 resetScores가 호출된다", () => {
    render(<ScoreBoard />);

    // '점수 초기화' 버튼 클릭
    fireEvent.click(screen.getByText("점수 초기화"));

    // resetScores 함수가 한 번 호출되었는지 확인
    expect(mockResetScores).toHaveBeenCalledTimes(1);
  });

  // 4. 초기화 대기 중일 때 로딩 상태를 표시하는지 테스트
  it("초기화 대기 중일 때 로딩 상태를 표시한다", () => {
    // useScoreStoreWithLocalStorage를 false로 설정하여 초기화되지 않은 상태를 시뮬레이션
    (useScoreStoreWithLocalStorage as jest.Mock).mockReturnValue(false);

    render(<ScoreBoard />);

    // "loading..." 메시지가 표시되는지 확인
    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  // 5. alert이 호출되는지 확인하는 테스트
  it("alert이 호출되는지 확인", () => {
    render(<ScoreBoard />);

    // '점수 초기화' 버튼 클릭
    fireEvent.click(screen.getByText("점수 초기화"));

    // alert 함수가 호출되었는지 확인
    expect(global.alert).toHaveBeenCalled();
  });
});
