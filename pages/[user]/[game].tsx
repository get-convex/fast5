import type { NextPage } from 'next'
import Head from 'next/head'
import {
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { useEffect, useState } from 'react';
import { useMutation, useConvex, useQuery } from "../../convex/_generated";
import { Id } from '@convex-dev/react';
import { create } from 'domain';
import { ALL_KEYS, handleGameInput } from '../../lib/game/input';
import { addToast, boot, pruneToasts } from '../../lib/game/flow';
import { backendGameState, backendRoundState, canEdit, currentLetters, currentRow, gameId, gameState, keyboardUsedState, needNewRound, roundWinner, submittedRow, toasts, User, userMe, username, userThem } from '../../lib/game/state';
import { dlog } from '../../lib/game/util';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useIntervalWhen, useKey, useTimeoutWhen } from 'rooks';
import { BackendGame, BackendRound } from '../../lib/game/proto';

const Game: NextPage = () => {
  const router = useRouter();
  const joinGame = useMutation("joinGame");
  const [gid, setGid] = useRecoilState(gameId);
  const [un, setUsername] = useRecoilState(username);
  useEffect(() => {
    const params = router.query;
    if (Object.keys(params).length !== 0) {
      boot(params, joinGame, setGid, setUsername);
    }
  }, [router, joinGame]);


  if (gid === null) {
    var body = <div></div>;
  } else {
    var body = <MatchContainer gid={gid} me={un} />;
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

const MatchContainer = (props: any) => {
  const gid = props.gid;
  const me = props.me;

  // Backend updates.
  const gameQuery = useQuery("queryGame", Id.fromString(gid));
  const roundQuery = useQuery("queryRound", Id.fromString(gid), me);

  // Connect to recoil atoms. TODO -- replace with nicer recoil-sync stuff
  const [ , setBackendGame] = useRecoilState(backendGameState);
  const [ , setBackendRound] = useRecoilState(backendRoundState);
  useEffect(() => {
    if (gameQuery !== undefined) {
      setBackendGame(gameQuery as BackendGame);
    }
  }, [gameQuery]);
  useEffect(() => {
    if (roundQuery !== undefined) {
      setBackendRound(roundQuery as BackendRound);
    }
  }, [roundQuery]);


  return (<div>
    <GameFlowDriver />
    <InputHandler />
    <div className="flex">
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

const Toasts = () => {
  const [tx, setTx] = useRecoilState(toasts);

  useIntervalWhen(() => {
    pruneToasts(tx, setTx);
  }, 1000, true);

  var tels = [];
  var i = 0;
  for (const t of tx) {
    i += 1;
    var outerClass = [
      "flex",
      "items-center",
      "m-2",
      "p-2",
      "space-x-4",
      "w-full",
      "max-w-xs",
      "text-gray-500",
      "bg-white",
      "rounded-lg",
      "divide-x",
      "divide-gray-200",
      "shadow",
      "dark:text-gray-800",
      "dark:divide-gray-700",
      "space-x",
    ];
    var innerClass = [
      "inline-flex",
      "flex-shrink-0",
      "justify-center",
      "items-center",
      "w-8",
      "h-8",
      "rounded-lg",
    ];

    var key = `toast-${i}`;
    if (t.category === "guessed") { 
      var oc = classNames(outerClass, ["dark:bg-green-200"]);
      var ic = classNames(innerClass, "text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200");
      var icon = <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>;
    } else if (t.category === "steal") {
      var oc = classNames(outerClass, ["dark:bg-yellow-200"]);
      var ic = classNames(innerClass, "text-orange-500 bg-orange-100 dark:bg-blue-700 dark:text-orange-200");
      var icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /> <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /> </svg>
    } else if (t.category === "error") {
      var oc = classNames(outerClass, ["dark:bg-red-200"])
      var ic = classNames(innerClass, "text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200");
      var icon = <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
    } else {
      throw "unknown toast category";
    }
    tels.push(
      <div key={key} className={oc} role="alert">
        <div className={ic}>
          {icon}
        </div>
        <div className="pl-4 text-sm font-normal">{t.message}</div>
      </div>
    )
  }
  return <div className="flex">{tels}</div>;
}

const Match = () => {
  const game = useRecoilValue(gameState);
  const me = useRecoilValue(userMe)!;
  const them = useRecoilValue(userThem)!;
  if (game=== null) {
    return <div className="flex justify-center w-full bg-purple-100"/>;
  }
  return (
  <div className="flex justify-center w-full bg-purple-100">
    <MatchUser user={me} isWinner={game.board?.winner === me.number} overallWinner={game.winner === me.number}/>
    <Round round={game.round} over={game.winner?? false} />
    <MatchUser user={them}  isWinner={game.board?.winner === them.number} overallWinner={game.winner === them.number}/>
  </div>
  );
}

const MatchUser = (props: any) => {
  var scoreClasses = [];
  if (props.isWinner) {
    scoreClasses.push("text-green-500");
  }

  if (props.overallWinner) {
    var winnerMark = <span>&#11088;</span>;
  } else {
    var winnerMark = <span></span>;
  }

  return (
    <div className="flex-auto m-4">
      <div>{winnerMark}<strong>{props.user.displayName}</strong></div>
      <div className={classNames(scoreClasses)}>Score: {props.user.score}</div>
    </div>
  );
}

const Round = (props: any) => {
  if (props.over) {
    var message = <div>Game over!</div>;
  } else if (props.round > 0) {
    var message = <div>Round: {props.round}</div>;
  } else {
    var message = <div>Get ready...</div>
  }
  return (
    <div className="flex-auto align-middle">
      {message}
    </div>
  );
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

const KeyBoardRow = (props: any) => {
  var keys = [];
  for (const letter of props.letters) {
    const state = props.keyMap.get(letter);
    const key = `kb-${letter}`;
    const cellClasses = ["flex-auto", "w-8", "text-center",  "m-1", "rounded"];
    if (!state) {
      var cls = classNames(cellClasses, "bg-gray-200");
    } else if (state === '0') {
      var cls = classNames(cellClasses, "bg-gray-400");
    } else if (state === '1') {
      var cls = classNames(cellClasses, "bg-yellow-400");
    } else if (state === '2') {
      var cls = classNames(cellClasses, "bg-green-400");
    } else {
      throw "Unknown key state"
    }
    keys.push(
      <div key={key} className={cls}>{letter}</div>
    );
  }
  return (
    <div key={props.rowkey} className="flex">{keys}</div>
  )
}

const Board = () => {
  const game = useRecoilValue(gameState);
  const me = useRecoilValue(userMe);
  const them = useRecoilValue(userThem);
  if (game?.board === null || me === null || them === null) {
    return <div className="flex w-full"></div>;
  }
  return (
    <div className="flex w-full">
      <BoardSide isOverflow={game?.board.overflow} user={me} isWinner={game?.board.winner === me!.number}/>
      <BoardSide isOverflow={game?.board.overflow} user={them} isWinner={game?.board.winner === them!.number} />
    </div>
  );
}

const BoardSide = (props: any) => {
  const user: User = props.user as User;
  var rows = [];
  var scoreRow = props.isOverflow ? user.board!.serverCount : user.board!.serverCount - 1;
  for (var i = 0; i < 6; i++) {
    let row = user.board!.rows[i];
    const isWrong = (i < scoreRow) || (i === (user.board!.serverCount  - 1) && !props.isWinner);
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

const BoardRow = (props: any) => {
  var cells = [];
  for (var i = 0; i < 5; i++) {
    cells.push(Cell({"code": props.cells[i], "key": i}));
  }

  var scoreClasses = ["flex-initial", "w-16"];
  if (props.isWinner) {
    scoreClasses.push("text-green-500");
    var score = <div className="flex-initial w-16 text-green-500">
          {props.score}
        </div>;
  } else if (props.isWrong) {
    scoreClasses.push("line-through");
    var score = <div className="flex-initial w-16 line-through">
          {props.score}
        </div>;
  }

  return (
    <div key={`row-${props.key}`} className="flex w-1/8 h-12 my-4">
      {cells}  
      <div className={classNames(scoreClasses)}>
        {props.score}
      </div>
    </div>
  )
}

const Cell = (props: any) => {

  if (props.code[1] !== '?') {
    var char = props.code[1] as string;
  } else {
    var char = '';
  }
  var cellClasses = [
    "rounded",
    "m-1",
    "flex-auto",
    "text-2xl",
    "text-center",
  ];
  if (props.code[0] === '?') {
    cellClasses.push("bg-gray-200");
  } else if (props.code[0] === '0') {
    cellClasses.push("bg-gray-400");
  } else if (props.code[0] === '1') {
    cellClasses.push("bg-yellow-400");
  } else if (props.code[0] === '2') {
    cellClasses.push("bg-green-400");
  } else if (props.code[0] === 'A') {
    cellClasses.push("bg-gray-100");
  } else if (props.code[0] === 'H') {
    cellClasses.push("bg-amber-100");
  } else if (props.code[0] === 'P') {
    cellClasses.push("bg-sky-100", "shadow-md", "text-gray-600");
  } else {
    throw 'unknown cell formatting code';
  }
  return (<div key={`cell-${props.key}`} className={classNames(cellClasses)}>{char}</div>)
}

const ROUND_START_DELAY = 7000;

const GameFlowDriver = () => {
  const needRound = useRecoilValue(needNewRound);
  const rwinner = useRecoilValue(roundWinner);
  const round = useRecoilValue(backendRoundState);
  const game = useRecoilValue(backendGameState);
  const me = useRecoilValue(userMe);
  const gid = useRecoilValue(gameId);

  // Let's use these to track what's been "seen" or not.
  const [serverRows, setServerRows] = useState(-1);
  const [user1Stolen, setUser1Stolen] = useState(false);
  const [user2Stolen, setUser2Stolen] = useState(false);

  const [ , setCurrentLetters] = useRecoilState(currentLetters);
  const [ , setSubmittedRow] = useRecoilState(submittedRow);
  const [ , setToasts] = useRecoilState(toasts);

  // 
  const createRound = useMutation("createRound");

  // Check for winner to notify via toast.
  useEffect(() => {
    if (rwinner !== null) {
      addToast(setToasts, `${rwinner} won the round!`, "guessed", 6000);
      setServerRows(-1);
      setUser1Stolen(false);
      setUser2Stolen(false);
      setCurrentLetters([]);
      setSubmittedRow(-1);
    }
  }, [rwinner])

  // Look for a new stolen state from either side to notify via toast.
  useEffect(() => {
    if (round !== null && rwinner === null) {
      if (round.user1.stolen && !user1Stolen) {
        setUser1Stolen(true);
        const stolenName = game!.user1.displayName;
        addToast(setToasts, `${stolenName} is stealing answers!`, "steal", 6000);
      }
      if (round.user2.stolen && !user2Stolen) {
        setUser2Stolen(true);
        const stolenName = game!.user2!.displayName;
        addToast(setToasts, `${stolenName} is stealing answers!`, "steal", 6000);
      }
    }
  });

  // Look for a new row of ours from the server -- if it's there, our submission was accepted
  useEffect(() => {
    if (me !== null && me.board !== null) {
      if (me.board!.serverCount > serverRows) {
        console.log("new server side row");
        setCurrentLetters([]);
        setSubmittedRow(-1);
        setServerRows(me.board!.serverCount);
      }
    }
  });

  useTimeoutWhen(() => {
    createRound(Id.fromString(gid!), game!.round);
  }, ROUND_START_DELAY, needRound);

  return <></>;
}

const InputHandler = () => {
  // Dependent getters and setters of atoms / selectors.
  const gid = useRecoilValue(gameId);
  const me = useRecoilValue(username);
  const ce = useRecoilValue(canEdit);
  const [cl, setCl] = useRecoilState(currentLetters);
  const cr = useRecoilValue(currentRow);
  const [ , setSr] = useRecoilState(submittedRow);
  const [ , setToasts] = useRecoilState(toasts);

  // Methods we might invoke in response to input.
  const guessWord = useMutation("guessWord");
  const steal = useMutation("steal");

  useKey(ALL_KEYS, handleGameInput(
    guessWord, steal, gid, me, ce, cl, setCl,
    cr, setSr, setToasts));

  return <></>;
}


export default Game;