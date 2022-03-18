import { atom, RecoilState, RecoilValueReadOnly, selector } from "recoil";
import { BackendGame, BackendRound } from "./proto";
import { BoardSide, buildBoardSide, dlog } from "./util";

// Server-set atoms.
export const backendGameState: RecoilState<null | BackendGame> = atom({
  key: 'backendMatchState',
  default: null as (null | BackendGame),
});

export const backendRoundState: RecoilState<null | BackendRound> = atom({
  key: 'backendRoundState',
  default: null as (null | BackendRound),
});

// URL-derived static atoms.
export const gameId: RecoilState<string | null> = atom({
  key: 'gameId',
  default: null as (string | null),
});

export const username: RecoilState<string> = atom({
  key: 'username',
  default: '',
});

// Locally-set in-game atoms.
export const submittedRow: RecoilState<number> = atom({
  key: 'submittedRow',
  default: -1,
});

export const currentLetters: RecoilState<string[]> = atom({
  key: 'currentLetters',
  default: [] as string[],
});

export interface Toast {
    message: string;
    category: string;
    expires: number;
    start: Date;
}

export const toasts: RecoilState<Toast[]> = atom({
  key: 'toasts',
  default: [] as Toast[],
});

// Derived game states from atoms.
export const canEdit: RecoilValueReadOnly<boolean> = selector({
  key: 'canEdit',
  get: ({get}) => {
    const backendRound = get(backendRoundState) as BackendRound;
    if (backendRound === null) {
      return false;
    }
    if (backendRound.winner !== null) {
      return false;
    }
    const submitted = get(submittedRow);
    const maybeUser = get(userMe);
    if (maybeUser === null) {
      return false;
    }
    const user = maybeUser as User;
    const maybeBoard = user.board;
    if (maybeBoard === null) {
        return false
    }
    const myRows = (maybeBoard as BoardSide).rows;
    if (myRows.length === submitted) {
      return false;
    }
    return true;
  }
});

const whoami: RecoilValueReadOnly<number | null> = selector({
    key: 'whoami',
    get: ({get}) => {
        const me = get(username);
        const backendGame = get(backendGameState);
        if (me === '') {
            return null;
        }
        if (backendGame === null) {
            return null;
        } 
        if (me === backendGame.user1.displayName) {
            return 1;
        } else if (me === backendGame.user2.displayName) {
            return 2;
        } 
        throw 'username does not game either user in backend';
    },
});

export interface BoardState {
    user1: BoardSide;
    user2: BoardSide;
    winner: number | null;
    overflow: boolean;
}
export interface GameState {
    round: number;
    user1: {
        displayName: string;
        score: number;
    };
    user2: null | {
        displayName: string;
        score: number;
    };
    inRound: boolean;
    ready: boolean;
    over: boolean;
    winner: number;
    board: null | BoardState;
}

export const gameState: RecoilValueReadOnly<null | GameState> = selector({
  key: 'gameState',
  get: ({get}) => {
    const backendGame = get(backendGameState);
    const backendRound = get(backendRoundState);
    const who = get(whoami);
    const current = get(currentRow);
    const cell = get(highlightedCell);
    const letters = get(currentLetters);
    const submitted = get(submittedRow);

    if (backendGame === null || who === null) {
        return null;
    } 
    var output = {
        ...backendGame,
        board: null as (null | BoardState),
    };
    if (backendRound !== null) {
        let u1 = buildBoardSide(backendRound.user1, who === 1 ? current! : -1, cell, letters, submitted);
        let u2 = buildBoardSide(backendRound.user2, who === 2 ? current! : -1, cell, letters, submitted);
        const board = {
            user1: u1,
            user2: u2,
            winner: backendRound.winner,
            overflow: backendRound.overflow,
        };
        output.board = board;
    }
    return output;
  }
});

export const keyboardUsedState = selector({
  key: 'keyboardUsedState',
  get: ({get}) => {
    const roundState = get(backendRoundState);
    var letterState = new Map();
    if (roundState === null) {
      console.log("empty keymap");
      return letterState;
    }

    for (const row of roundState.user1.guesses) {
      for (const pair of row) {
        const letter = pair[1];
        const state = pair[0];
        if (letter !== '?' && (!letterState.has(letter) || state > letterState.get(letter))) {
          letterState.set(letter, state);
        }
      }
    }
    for (const row of roundState.user2.guesses) {
      for (const pair of row) {
        const letter = pair[1];
        const state = pair[0];
        if (letter !== '?' && (!letterState.has(letter) || state > letterState.get(letter))) {
          letterState.set(letter, state);
        }
      }
    }
    console.log(`keymap = ${JSON.stringify(letterState)}`);
    return letterState;
  },
});

export interface User {
    displayName: string;
    score: number;
    number: number;
    key: string;
    board: BoardSide | null;
}

export const userMe: RecoilValueReadOnly<null | User> = selector({
  key: 'userMe',
  get: ({get}) => {
      return userGetter(get, false);
  },
});

export const userThem: RecoilValueReadOnly<null | User> = selector({
  key: 'userThem',
  get: ({get}) => {
      return userGetter(get, true);
  },
});

function userGetter(get: any, them: boolean): null | User {
    const game = get(gameState);
    const who = get(whoami);

    if (who === null || game === null) {
        return null;
    }
    var number = who;

    var grec = game.user1;
    var uboard = game.board === null ? null : game.board.user1;
    var key = "user1";
    if ((who === 2 && !them) || (who === 1 && them)) {
        grec = game.user2;
        uboard = game.board === null ? null : game.board.user2;
        key = "user2";
    } 

    if (them) {
        number = who == 2 ? 1 : 2;
    }

    return {
        displayName: grec.displayName,
        score: grec.score,
        number: number,
        key: key,
        board: uboard,
    }
  }

export const currentRow = selector({
  key: 'currentRow',
  get: ({get}) => {
    const userId = get(whoami);
    const round = get(backendRoundState);
    const who = get(whoami) as number;
    if (round === null || who === null) {
        return null;
    }
    if (who === 1) {
      return round.user1.guesses.length;
    } else {
      return round.user2.guesses.length;
    }
    return null;
  },
});

export const highlightedCell = selector({
  key: 'highlightedCell',
  get: ({get}) => {
      const letters = get(currentLetters);
      return letters.length >= 5 ? 4 : letters.length;
  },
});