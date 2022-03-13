import type { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import queryString from 'query-string';
import { useEffect } from 'react';
import { getRecoil, setRecoil } from "recoil-nexus";
import { useMutation, useConvex } from "../convex/_generated";
import { Id } from '@convex-dev/react';
import { create } from 'domain';
import guessWord from '../convex/guessWord';

var isAlpha = function(ch){
  return typeof ch === "string" && ch.length === 1 && /[A-Za-z]/.test(ch);
}

function keyProcessor(guessWord, steal) {
  return (event: KeyboardEvent) => {
    console.log(event);
    if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122)) {
      const letter = event.key.toLocaleUpperCase();
      if (getRecoil(canEdit)) {
        setRecoil(currentLetters, (letters) => {
          var letters = [...letters];
          if (letters.length === 5) {
            return letters;
          }
          letters.push(letter);
          return letters;
        });
      }
    } else if (event.key === "Backspace") {
      if (getRecoil(canEdit)) {
        setRecoil(currentLetters, (letters) => {
          var letters = letters.slice(0, -1);
          return letters;
        });
      }
    } else if (event.key === "Enter") {
      if (getRecoil(canEdit) && getRecoil(currentLetters).length === 5) {
        setRecoil(submittedRow, getRecoil(currentRow));
        let gid = getRecoil(gameId);
        let me = getRecoil(username);
        let letters = getRecoil(currentLetters);
        const tryGuess = async () => {
          let tryWord = letters.join('');
          let validGuess = await guessWord(Id.fromString(gid), me, tryWord);
          if (!validGuess) {
            addToast(`Invalid word '${tryWord}'`, "error", 5000);
            setRecoil(submittedRow, -1);
            setRecoil(currentLetters, []);
          }
        };
        tryGuess();
      }
    } else if (event.key === '!') {
      let gid = getRecoil(gameId);
      let me = getRecoil(username);
      const doSteal = async() => {
        await steal(Id.fromString(gid), me);
      };
      doSteal()
    }
  };
}

const Home: NextPage = () => {
  console.log("starting");
  const joinGame = useMutation("joinGame");
  const guessWord = useMutation("guessWord");
  const steal = useMutation("steal");
  useEffect(() => {
    setInterval(pruneToasts, 1000);
    const params = queryString.parse(document.location.search);
    const me: string = params['user'] as string;
    const gamename: string = params['game'] as string;
    setRecoil(username, me);
    const body = document.getElementsByTagName('body')[0];
    body.addEventListener("keydown", keyProcessor(guessWord, steal));
    const startGame = async() => {
      console.log(`me = ${me}, gamename = ${gamename}`);
      const gid = await joinGame(me, gamename);
      console.log(`Got gid = ${gid}`);
      if (gid === null) {
        console.log("Failed to join game...");
      } else {
        setRecoil(gameId, gid.toString());
      }
    }
    if (getRecoil(gameId) === "") {
      startGame();
    }
  }, []);

  const gid = useRecoilValue(gameId);

  if (gid === "") {
    var body = <div></div>;
  } else {
    var body = <MatchContainer gid={gid} />;
  }

  return (
    <div>
      <Head>
        <title>Fast5</title>
        <meta name="description" content="Word racing at its finest" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="px-0">
        <div className="justify-center bg-slate-900 text-yellow-600 p-2 flex">
          <div className="">Fast5</div>
        </div>
        {body}
      </main>
    </div>
  )
}

var timerSetForRound = false;
function scheduleRoundStart(createRound) {
  if (!timerSetForRound) {
    timerSetForRound = true;
    setTimeout(async () => {
      console.log("Trying to start round");
      timerSetForRound = false;
      const gid = getRecoil(gameId);
      const backendGame = getRecoil(backendMatchState);
      await createRound(Id.fromString(gid), backendGame.round);
    }, 7000);
  }
}

var gameStarted = false;
function advanceGame(backendData, createRound) {
  // Basically, do we need to start another round?
  if (backendData.ready && !gameStarted) {
    console.log("Trying to start game");
    gameStarted = true;
    scheduleRoundStart(createRound);
  }
}

var serverRows = -1;
var serverStolen = {1: false, 2: false};
function advanceRound(backendData, createRound) {
  const me = getRecoil(username);
  const game = getRecoil(backendMatchState);
  console.log(`Server rows: ${serverRows}`);
  if (backendData.winner) {
    const winName = game['user' + backendData.winner].displayName;
    addToast(`${winName} won the round!`, "guessed", 6000);
    serverRows = -1;
    serverStolen = {1: false, 2: false};
    setRecoil(currentLetters, []);
    setRecoil(submittedRow, -1);
    scheduleRoundStart(createRound);
    return;
  }

  if (backendData.user1.stolen && !serverStolen[1]) {
    serverStolen[1] = true;
    const stolenName = game.user1.displayName;
    addToast(`${stolenName} is stealing answers!`, "steal", 6000);
  }
  if (backendData.user2.stolen && !serverStolen[2]) {
    serverStolen[2] = true;
    const stolenName = game.user2.displayName;
    addToast(`${stolenName} is stealing answers!`, "steal", 6000);
  }

  if (game.user1.displayName === me) {
    var side = backendData.user1;
  } else {
    var side = backendData.user2;
  }

  if (side.guesses.length > serverRows) {
    console.log("new server side row");
    setRecoil(currentLetters, []);
    setRecoil(submittedRow, -1);
    serverRows = side.guesses.length;
  }
}

const MatchContainer = (props) => {
  const gid = props.gid;
  const me = getRecoil(username);
  const createRound = useMutation("createRound");
  useConvex().query("queryGame").watch(Id.fromString(gid)).onUpdate((backendData) => {
    console.log(`got backend game update ${JSON.stringify(backendData)}`);
    advanceGame(backendData, createRound);
    setRecoil(backendMatchState, backendData);
  });
  useConvex().query("queryRound").watch(Id.fromString(gid), me).onUpdate((backendData) => {
    console.log(`got backend round update ${JSON.stringify(backendData)}`);
    advanceRound(backendData, createRound);
    setRecoil(backendBoardState, backendData);
  });

  return (<div><div className="flex">
    <Match />
  </div>
  <div className="flex h-14">
    <Toasts />
  </div>
  <div className="flex">
    <Board />
  </div>
    <KeyBoard />
  </div>
  );
}

const canEdit = selector({
  key: 'canEdit',
  get: ({get}) => {
    const backendBoard = get(backendBoardState);
    if (backendBoard === null) {
      return false;
    }
    if (backendBoard.winner !== null) {
      return false;
    }
    const submitted = get(submittedRow);
    const userId = get(whichUser);
    if (userId === '') {
      return false;
    }
    const myRows = backendBoard[userId].guesses;
    if (myRows.length === submitted) {
      return false;
    }
    return true;
  }
});

const submittedRow = atom({
  key: 'submittedRow',
  default: -1,
});

const currentLetters = atom({
  key: 'currentLetters',
  default: [],
});

const highlightedCell = selector({
  key: 'highlightedCell',
  get: ({get}) => {
    if (get(canEdit)) {
      const letters = get(currentLetters);
      return letters.length >= 5 ? 4 : letters.length;
    }
    return -1;
  },
});

const username = atom({
  key: 'username',
  default: '',
});

const gameId = atom({
  key: 'gameId',
  default: '',
});

const whichUser = selector({
  key: 'whichUser',
  get: ({get}) => {
    const me = get(username);
    const match = get(backendMatchState);
    if (empty(match)) {
      return null;
    }
    if (match.user1.displayName === me) {
      return 'user1';
    } else if (match.user2.displayName === me) {
      return 'user2';
    } else if (me === '') {
      return '';
    }
    throw 'username does not match either user in backend';
  }
});

const currentRow = selector({
  key: 'currentRow',
  get: ({get}) => {
    const userId = get(whichUser);
    const board = get(backendBoardState);
    if (userId !== '' && !empty(board)) {
      const myBoard = board[userId!];
      return myBoard.guesses.length;
    }
    return null;
  },
});

const backendMatchState = atom({
  key: 'backendMatchState',
  default: {}
});

const backendBoardState = atom({
  key: 'backendBoardState',
  default: {}
});

const toasts = atom({
  key: 'toasts',
  default: [],
});

function addToast(message: string, category: string, durationMs: number) {
  console.log("Add toast");
  var tx = [...getRecoil(toasts)];
  tx.splice(0, 0, {
    message: message,
    category: category,
    expires: durationMs,
    start: new Date(),
  });
  setRecoil(toasts, tx);
}

function pruneToasts() {
  var tx = [...getRecoil(toasts)];
  // Assumes no premption.
  const now = new Date();
  var changed = false;
  for (var i = tx.length - 1; i >= 0; i--) {
    const t = tx[i];
    if (now - t.start > t.expires) {
      tx.splice(i, 1);
      changed = true;
    }
  }
  if (changed) {
    setRecoil(toasts, tx);
  }
}

const Toasts = () => {
  var tels = [];
  const tx = useRecoilValue(toasts);
  console.log(`toasts = ${JSON.stringify(tx)}`);
  var i = 0;
  for (const t of tx) {
    console.log(`toast = ${JSON.stringify(t)}`);
    i += 1;
    if (t.category === "guessed") { 
      let key = `toast-${i}`;
      tels.push(<div key={key} className="flex items-center m-2 p-2 space-x-4 w-full max-w-xs text-gray-500 bg-white rounded-lg divide-x divide-gray-200 shadow dark:text-gray-800 dark:divide-gray-700 space-x dark:bg-green-200" role="alert">
      <div className="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>
      </div>
      <div className="pl-4 text-sm font-normal">{t.message}</div>
    </div>);
    } else if (t.category === "steal") {
      let key = `toast-${i}`;
      tels.push(<div key={key} className="flex items-center m-2 p-2 space-x-4 w-full max-w-xs text-gray-500 bg-white rounded-lg divide-x divide-gray-200 shadow dark:text-gray-800 dark:divide-gray-700 space-x dark:bg-yellow-200" role="alert">
      <div className="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-blue-700 dark:text-orange-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /> <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /> </svg>
      </div>
      <div className="pl-4 text-sm font-normal">{t.message}</div>
    </div>);
    } else if (t.category === "error") {
      let key = `toast-${i}`;
      tels.push(<div key={key} className="flex items-center m-2 p-2 space-x-4 w-full max-w-xs text-gray-500 bg-white rounded-lg divide-x divide-gray-200 shadow dark:text-gray-800 dark:divide-gray-700 space-x dark:bg-red-200" role="alert">
      <div className="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
    </div>
      <div className="pl-4 text-sm font-normal">{t.message}</div>
    </div>);
    }
  }
  return tels;
}

const aggregatedBoardState = selector({
  key: 'aggregatedBoardState',
  get: ({get}) => {
    const backendBoard = get(backendBoardState);
    if (empty(backendBoard)) {
      return {};
    }
    const current = get(currentRow);
    const cell = get(highlightedCell);
    const letters = get(currentLetters);
    const user = get(whichUser);
    const submitted = get(submittedRow);

    let u1 = buildBoardSide(backendBoard.user1, user === 'user1' ? current : null, cell, letters, submitted);
    let u2 = buildBoardSide(backendBoard.user2, user === 'user2' ? current : null, cell, letters, submitted);
    return {
      user1: u1,
      user2: u2,
      winner: backendBoard.winner,
      overflow: backendBoard.overflow,
    };
  }
});

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const keyboardUsedState = selector({
  key: 'keyboardUsedState',
  get: ({get}) => {
    const boardState = get(backendBoardState);
    var letterState = new Map();
    console.log(boardState);
    if (empty(boardState)) {
      console.log("empty keymap");
      return letterState;
    }

    for (const row of boardState.user1.guesses) {
      for (const pair of row) {
        const letter = pair[1];
        const state = pair[0];
        if (letter !== '?' && (!letterState.has(letter) || state > letterState.get(letter))) {
          letterState.set(letter, state);
        }
      }
    }
    for (const row of boardState.user2.guesses) {
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

function buildBoardSide(board, current, cell, letters, submitted) {
    var rows = [];
    for (var i = 0; i < 6; i++) {
      var cells: string[] = [];
      if (board.guesses.length <= i) {
        if (current === i) {
          for (var j = 0; j < 5; j++) {
            if (submitted === i) {
              cells.push('P' + letters[j]);
            } else if (letters.length > j) {
              cells.push('A' + letters[j]);
            } else if (cell === j) {
              cells.push('H?');
            } else {
              cells.push('A?');
            }
          }
        } else {
          cells = ['??', '??', '??', '??', '??'];
        }
      } else {
        cells = board.guesses[i];
      }
      var row = {score: board.scores[i], active: false, cells: cells};
      rows.push(row);
    }
    return {
      serverCount: board.guesses.length,
      rows: rows,
      stolen: board.stolen,
    }
}

function empty(o: Object): boolean {
  return Object.keys(o).length === 0
}

export default Home

const Match = () => {
  const matchState = useRecoilValue(backendMatchState);
  const boardState = useRecoilValue(aggregatedBoardState);
  const user = useRecoilValue(whichUser);
  if (empty(matchState)) {
    return <div className="flex justify-center w-full bg-purple-100"/>;
  }
  if (user === "user1") {
    return (
    <div className="flex justify-center w-full bg-purple-100">
      <MatchUser user={matchState["user1"]} isWinner={boardState.winner === 1} overallWinner={matchState.winner === 1}/>
      <Round round={matchState["round"]} over={matchState.winner !== 0} />
      <MatchUser user={matchState["user2"]}  isWinner={boardState.winner === 2} overallWinner={matchState.winner === 2}/>
    </div>
    );
  } else {
    return (
    <div className="flex justify-center w-full bg-purple-100">
      <MatchUser user={matchState["user2"]}  isWinner={boardState.winner === 2} overallWinner={matchState.winner === 2}/>
      <Round round={matchState["round"]} over={matchState.winner !== 0} />
      <MatchUser user={matchState["user1"]} isWinner={boardState.winner === 1} overallWinner={matchState.winner === 1}/>
    </div>
    );

  }
}

const MatchUser = (props) => {
  if (props.isWinner) {
    var score = <div className="text-green-500">Score: {props.user.score}</div>;
  } else {
    var score = <div>Score: {props.user.score}</div>;
  }

  if (props.overallWinner) {
    var winnerMark = <span>&#11088;</span>;
  } else {
    var winnerMark = <span></span>;
  }

  return (
    <div className="flex-auto m-4">
      <div>{winnerMark}<strong>{props.user.displayName}</strong></div>
      {score}
    </div>
  );
}

const Round = (props) => {
  if (props.over) {
      return (
      <div className="flex-auto">
        Game Over!
      </div>
    );
  } else if (props.round > 0) {
    return (
      <div className="flex-auto align-middle">
        <div>Round: {props.round}</div>
      </div>
    );
  } else {
    return (
      <div className="flex-auto">
        Get ready...
      </div>
    );
  }
}

const KeyBoard = () => {
  const keyMap = useRecoilValue(keyboardUsedState);
  console.log(`km = ${JSON.stringify(keyMap)}`);
  const rows = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM",
  ];

  return (
    <div className="w-1/2 mx-auto items-center">
      <KeyBoardRow rowkey={0} letters={rows[0]} keyMap={keyMap} />
      <KeyBoardRow rowkey={1} letters={rows[1]} keyMap={keyMap} />
      <KeyBoardRow rowkey={2} letters={rows[2]} keyMap={keyMap} />
    </div>
  )
}

const KeyBoardRow = (props) => {
  var keys = [];
  for (const letter of props.letters) {
    const state = props.keyMap.get(letter);
    const key = `kb-${letter}`;
    if (!state) {
      keys.push(
        <div key={key} className="flex-auto w-8 text-center m-1 rounded bg-gray-200">{letter}</div>
      );
    } else if (state === '0') {
      keys.push(
        <div key={key} className="flex-auto w-8 text-center m-1 rounded bg-gray-400">{letter}</div>
      );
    } else if (state === '1') {
      keys.push(
        <div key={key} className="flex-auto w-8 m-1 text-center rounded bg-yellow-400">{letter}</div>
      );
    } else if (state === '2') {
      keys.push(
        <div key={key} className="flex-auto w-8 m-1 text-center rounded bg-green-400">{letter}</div>
      );
    }
  }
  return (
    <div key={props.rowkey} className="flex">{keys}</div>
  )
}

const Board = () => {
  const boardState = useRecoilValue(aggregatedBoardState);
  const me = useRecoilValue(whichUser);
  const user = useRecoilValue(whichUser);
  if (empty(boardState)) {
    return <div className="flex w-full"></div>;
  }
  if (user === "user1") {
    return (
      <div className="flex w-full">
        <BoardSide isOverflow={boardState.overflow} user={boardState.user1} isWinner={boardState.winner === 1}/>
        <BoardSide isOverflow={boardState.overflow} user={boardState.user2} isWinner={boardState.winner === 2} />
      </div>
    );
  } else {
    return (
      <div className="flex w-full">
        <BoardSide isOverflow={boardState.overflow} user={boardState.user2} isWinner={boardState.winner === 2} />
        <BoardSide isOverflow={boardState.overflow} user={boardState.user1} isWinner={boardState.winner === 1}/>
      </div>
    );
  }
  
}

const BoardSide = (props) => {
  var rows = [];
  var scoreRow = props.isOverflow ? props.user.serverCount : props.user.serverCount - 1;
  for (var i = 0; i < 6; i++) {
    let row = props.user.rows[i];
    const isWrong = (i < scoreRow) || (i === (props.user.serverCount  - 1) && !props.isWinner);
    rows.push(BoardRow({"cells": row.cells, "key": i, "score": row.score,
     "isWinner": props.isWinner && scoreRow == i,
     "isWrong": isWrong}));
  }

  if (props.isWinner) {
    return (<div className="w-full mx-8 bg-yellow-50">{rows}</div>);
  } else {
    return (<div className="w-full mx-8">{rows}</div>);
  }
}

const BoardRow = (props) => {
  var cells = [];
  for (var i = 0; i < 5; i++) {
    cells.push(Cell({"code": props.cells[i], "key": i}));
  }

  if (props.isWinner) {
    var score = <div className="flex-initial w-16 text-green-500">
          {props.score}
        </div>;
  } else if (props.isWrong) {
    var score = <div className="flex-initial w-16 line-through">
          {props.score}
        </div>;
  } else {
    var score = <div className="flex-initial w-16">
          {props.score}
        </div>;

  }

  return (
    <div key={`row-${props.key}`} className="flex w-1/8 h-12 my-4">
      {cells}  
      {score}
    </div>
  )

}

const Cell = (props) => {

  if (props.code[1] !== '?') {
    var char = props.code[1];
  } else {
    var char = '';
  }
  if (props.code[0] === '?') {
    return (<div key={`cell-${props.key}`} className="rounded m-1 flex-auto bg-gray-200 text-2xl text-center">{char}</div>)
  } else if (props.code[0] === '0') {
    return (<div key={`cell-${props.key}`} className="rounded m-1 flex-auto bg-gray-400 shadow-md text-2xl text-center">{char}</div>)
  } else if (props.code[0] === '1') {
    return (<div key={`cell-${props.key}`} className="rounded m-1 flex-auto bg-yellow-400 shadow-md text-2xl text-center">{char}</div>)
  } else if (props.code[0] === '2') {
    return (<div key={`cell-${props.key}`} className="rounded m-1 flex-auto bg-green-400 shadow-md text-2xl text-center">{char}</div>)
  } else if (props.code[0] === 'A') {
    return (<div key={`cell-${props.key}`} className="rounded m-1 flex-auto bg-gray-100 shadow-md text-2xl text-center">{char}</div>)
  } else if (props.code[0] === 'H') {
    return (<div key={`cell-${props.key}`} className="rounded m-1 flex-auto bg-amber-100 shadow-md text-2xl text-center">{char}</div>)
  } else if (props.code[0] === 'P') {
    return (<div key={`cell-${props.key}`} className="rounded m-1 flex-auto bg-sky-300 animate-pulse shadow-md text-gray-600 text-2xl text-center">{char}</div>)
  } else {
    throw 'unknown cell formatting code';
  }
}