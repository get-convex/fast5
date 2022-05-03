import { useAuth0 } from '@auth0/auth0-react';
import classNames from 'classnames';
import { Id } from 'convex-dev/values';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { useIntervalWhen, useKey, useTimeoutWhen } from 'rooks';
import Board from '../../components/Board/Board';
import { useConvex, useMutation, useQuery } from '../../convex/_generated';
import { addToast, boot, pruneToasts } from '../../lib/game/flow';
import { ALL_KEYS, handleGameInput } from '../../lib/game/input';
import { BackendGame, BackendRound } from '../../lib/game/proto';
import {
  backendGameState,
  backendRoundState,
  canEdit,
  currentLetters,
  currentRow,
  gameId,
  gameName,
  gameOver,
  gameState,
  needNewRound,
  roundWinner,
  submittedRow,
  toasts,
  userMe,
  userThem,
} from '../../lib/game/state';

const Game: NextPage = () => {
  const router = useRouter();
  const joinGame = useMutation('joinGame');
  const convex = useConvex();
  const [gid, setGid] = useRecoilState(gameId);
  const [_, setGameName] = useRecoilState(gameName);
  let { isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();

  // Reseting game state
  const resetBackendGameState = useResetRecoilState(backendGameState);
  const resetBackendRoundState = useResetRecoilState(backendRoundState);
  const resetGameId = useResetRecoilState(gameId);
  const resetGameName = useResetRecoilState(gameName);
  const resetSubmittedRow = useResetRecoilState(submittedRow);
  const resetCurrentLetters = useResetRecoilState(currentLetters);
  const resetToasts = useResetRecoilState(toasts);
  useEffect(() => {
    resetBackendGameState();
    resetBackendRoundState();
    resetGameId();
    resetGameName();
    resetSubmittedRow();
    resetCurrentLetters();
    resetToasts();
  }, [
    resetBackendGameState,
    resetBackendRoundState,
    resetGameId,
    resetGameName,
    resetSubmittedRow,
    resetCurrentLetters,
    resetToasts,
  ]);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isAuthenticated) {
      getIdTokenClaims().then(async (claims) => {
        // Get the raw ID token from the claims.
        let token = claims!.__raw;
        // Pass it to the Convex client.
        convex.setAuth(token);
      });
    } else {
      // Tell the Convex client to clear all authentication state.
      convex.clearAuth();
      router.push('/'); // Go back to login.
    }
  }, [isAuthenticated, isLoading, getIdTokenClaims, convex, router]);
  useEffect(() => {
    const params = router.query;
    console.log('should boot?');
    if (isAuthenticated && Object.keys(params).length !== 0) {
      console.log('booting');
      boot(params, joinGame, setGid, setGameName);
    }
  }, [router, joinGame, setGid, isAuthenticated, setGameName]);

  if (gid === null) {
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
      {body}
    </div>
  );
};

const MatchContainer = (props: any) => {
  const gid = props.gid;

  // Backend updates.
  const gameQuery = useQuery('queryGame', Id.fromString(gid));
  const roundQuery = useQuery('queryRound', Id.fromString(gid));

  // Connect to recoil atoms. TODO -- replace with nicer recoil-sync stuff
  const [, setBackendGame] = useRecoilState(backendGameState);
  const [, setBackendRound] = useRecoilState(backendRoundState);
  useEffect(() => {
    if (gameQuery !== undefined) {
      console.log(gameQuery);
      setBackendGame(gameQuery as BackendGame);
    }
  }, [gameQuery, setBackendGame, setBackendRound]);
  useEffect(() => {
    if (roundQuery !== undefined) {
      setBackendRound(roundQuery as BackendRound);
    }
  }, [roundQuery, setBackendRound]);

  return (
    <div>
      <GameFlowDriver />
      <InputHandler />
      <div className="flex h-14">
        <Toasts />
      </div>
      <Board />
    </div>
  );
};

const Toasts = () => {
  const [tx, setTx] = useRecoilState(toasts);

  useIntervalWhen(
    () => {
      pruneToasts(tx, setTx);
    },
    1000,
    true
  );

  var tels = [];
  var i = 0;
  for (const t of tx) {
    i += 1;
    var outerClass = [
      'flex',
      'items-center',
      'm-2',
      'p-2',
      'space-x-4',
      'w-full',
      'max-w-xs',
      'text-gray-500',
      'bg-white',
      'rounded-lg',
      'divide-x',
      'divide-gray-200',
      'shadow',
      'dark:text-gray-800',
      'dark:divide-gray-700',
      'space-x',
    ];
    var innerClass = [
      'inline-flex',
      'flex-shrink-0',
      'justify-center',
      'items-center',
      'w-8',
      'h-8',
      'rounded-lg',
    ];

    var key = `toast-${i}`;
    if (t.category === 'guessed') {
      var oc = classNames(outerClass, ['dark:bg-green-200']);
      var ic = classNames(
        innerClass,
        'text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200'
      );
      var icon = (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
          ></path>
        </svg>
      );
    } else if (t.category === 'spy') {
      var oc = classNames(outerClass, ['dark:bg-yellow-200']);
      var ic = classNames(
        innerClass,
        'text-orange-500 bg-orange-100 dark:bg-blue-700 dark:text-orange-200'
      );
      var icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          {' '}
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />{' '}
          <path
            fillRule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
          />{' '}
        </svg>
      );
    } else if (t.category === 'error') {
      var oc = classNames(outerClass, ['dark:bg-red-200']);
      var ic = classNames(
        innerClass,
        'text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200'
      );
      var icon = (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      );
    } else {
      throw 'unknown toast category';
    }
    tels.push(
      <div key={key} className={oc} role="alert">
        <div className={ic}>{icon}</div>
        <div className="pl-4 text-sm font-normal">{t.message}</div>
      </div>
    );
  }
  return <div className="flex">{tels}</div>;
};

const Round = (props: any) => {
  if (props.over) {
    var message = <div>Game over!</div>;
  } else if (props.round > 0) {
    var message = <div>Round: {props.round}</div>;
  } else {
    var message = <div>Get ready...</div>;
  }
  return <div className="flex-auto align-middle">{message}</div>;
};

const ROUND_START_DELAY = 7000;

const GameFlowDriver = () => {
  const needRound = useRecoilValue(needNewRound);
  const rwinner = useRecoilValue(roundWinner);
  const gover = useRecoilValue(gameOver);
  const round = useRecoilValue(backendRoundState);
  const game = useRecoilValue(backendGameState);
  const me = useRecoilValue(userMe);
  const gid = useRecoilValue(gameId);

  const router = useRouter();

  // Let's use these to track what's been "seen" or not.
  const [serverRows, setServerRows] = useState(-1);
  const [user1Spying, setUser1Spying] = useState(false);
  const [user2Spying, setUser2Spying] = useState(false);

  const [, setCurrentLetters] = useRecoilState(currentLetters);
  const [, setSubmittedRow] = useRecoilState(submittedRow);
  const [, setToasts] = useRecoilState(toasts);

  //
  const createRound = useMutation('createRound');

  // Check for winner to notify via toast.
  useEffect(() => {
    if (rwinner !== null) {
      addToast(setToasts, `${rwinner} won the round!`, 'guessed', 6000);
      setServerRows(-1);
      setUser1Spying(false);
      setUser2Spying(false);
      setCurrentLetters([]);
      setSubmittedRow(-1);
    }
  }, [rwinner, setCurrentLetters, setSubmittedRow, setToasts]);

  // Look for a new spying state from either side to notify via toast.
  useEffect(() => {
    if (round !== null && rwinner === null) {
      if (round.user1.spying && !user1Spying) {
        setUser1Spying(true);
        const spyingName = game!.user1.displayName;
        addToast(setToasts, `${spyingName} is spying!`, 'spy', 6000);
      }
      if (round.user2.spying && !user2Spying) {
        setUser2Spying(true);
        const spyingName = game!.user2!.displayName;
        addToast(setToasts, `${spyingName} is spying!`, 'spy', 6000);
      }
    }
  }, [setToasts, game, round, rwinner, user1Spying, user2Spying]);

  // Look for a new row of ours from the server -- if it's there, our submission was accepted
  useEffect(() => {
    if (me !== null && me.board !== null) {
      if (me.board!.serverCount > serverRows && rwinner === null) {
        console.log('new server side row');
        setCurrentLetters([]);
        setSubmittedRow(-1);
        setServerRows(me.board!.serverCount);
      }
    }
  }, [
    setServerRows,
    rwinner,
    me,
    serverRows,
    setCurrentLetters,
    setSubmittedRow,
  ]);

  useTimeoutWhen(
    () => {
      createRound(Id.fromString(gid!), game!.round);
    },
    ROUND_START_DELAY,
    needRound
  );

  useTimeoutWhen(
    () => {
      router.push('/');
    },
    ROUND_START_DELAY,
    gover
  );

  return <></>;
};

const InputHandler = () => {
  // Dependent getters and setters of atoms / selectors.
  const gid = useRecoilValue(gameId);
  const ce = useRecoilValue(canEdit);
  const [cl, setCl] = useRecoilState(currentLetters);
  const cr = useRecoilValue(currentRow);
  const [, setSr] = useRecoilState(submittedRow);
  const [, setToasts] = useRecoilState(toasts);

  // Methods we might invoke in response to input.
  const guessWord = useMutation('guessWord');
  const spy = useMutation('spy');

  useKey(
    ALL_KEYS,
    handleGameInput(guessWord, spy, gid, ce, cl, setCl, cr, setSr, setToasts)
  );

  return <></>;
};

export default Game;
