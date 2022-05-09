import { useAuth0 } from '@auth0/auth0-react';
import { Id } from 'convex-dev/values';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { useIntervalWhen, useKey, useTimeoutWhen } from 'rooks';
import Board from '../../components/Board/Board';
import Toasts from '../../components/Toasts/Toasts';
import ping from '../../convex/ping';
import { useConvex, useMutation, useQuery } from '../../convex/_generated';
import { addToast, boot } from '../../lib/game/flow';
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
  needNewRound,
  roundWinner,
  submittedRow,
  toasts,
  userMe,
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
    // Reset all this when we navigate away.
    return () => {
      resetBackendGameState();
      resetBackendRoundState();
      resetGameId();
      resetGameName();
      resetSubmittedRow();
      resetCurrentLetters();
      resetToasts();
    };
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
      <div className="flex h-14 m-2">
        <Toasts />
      </div>
      <Board />
    </div>
  );
};

const ROUND_START_DELAY = 7000;
const PING_INTERVAL = 10000;

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

  // Convex mutations
  const createRound = useMutation('createRound');
  const pingGame = useMutation('ping');

  // Check for winner to notify via toast.
  useEffect(() => {
    if (rwinner !== null && serverRows !== -1) {
      addToast(setToasts, `${rwinner.winner} won the round! The word was ${rwinner.word}`, 'guessed', 6000);
      setServerRows(-1);
      setUser1Spying(false);
      setUser2Spying(false);
      setCurrentLetters([]);
      setSubmittedRow(-1);
    }
  }, [rwinner, setCurrentLetters, setSubmittedRow, setToasts, serverRows]);

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
  useIntervalWhen(
    () => {
      pingGame(Id.fromString(gid!));
    },
    PING_INTERVAL,
    true
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
