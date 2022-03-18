import { Id } from "@convex-dev/server";
import { create } from "domain";
import { getRecoil, setRecoil } from "recoil-nexus";
import { watchKeys } from "./input";
import { BackendGame, BackendRound } from "./proto";
import { backendGameState, backendRoundState, BoardState, currentLetters, currentRow, gameId, GameState, gameState, submittedRow, toasts, User, userMe, username } from "./state";
import { BoardSide, dlog, enableDebugLogging } from "./util";

export function boot(params: any, joinGame: any, guessWord: any, steal: any, createRound: any) {
    console.log("boot");
    enableDebugLogging();
    dlog(params);
    setInterval(drive, 100, createRound);
    const me: string = params['user'] as string;
    const gamename: string = params['game'] as string;
    setRecoil(username, me);
    const body = document.getElementsByTagName('body')[0];
    body.addEventListener("keydown", watchKeys(guessWord, steal));
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
    if (getRecoil(gameId) === null) {
      startGame();
    }
}

export function handleBackendGameUpdate(backendData: BackendGame) {
    dlog(`got backend game update ${JSON.stringify(backendData)}`);
    setRecoil(backendGameState, backendData);
}

export function handleBackendRoundUpdate(backendData: any) {
    dlog(`got backend round update ${JSON.stringify(backendData)}`);
    setRecoil(backendRoundState, backendData as BackendRound);
}

var gameStarted = false;
var serverRows = -1;
var serverStolen = {1: false, 2: false};
var betweenRounds = false;
export function drive(createRound: any) {
    pruneToasts();
    const game: GameState | null = getRecoil(gameState);
    const gid: string  | null = getRecoil(gameId);
    const me: User | null = getRecoil(userMe);
//    dlog('drive', game, gid, me);
    // No action yet, nothing to drive.
    if (game === null || gid === null || me === null) {
        return;
    }
    // Wait for both players to be present.
    if (!game.ready) {
        return;
    }
    // Both players present, but haven't started a round yet...
    if (game.board === null) {
        if (!gameStarted) {
            gameStarted = true;
            scheduleRoundStart(createRound);
        }
        // Gotta wait until someone starts the round.
        return;
    }

    const board = game.board!;
    const user1 = game.user1;
    const user2 = game.user2!;

    // Check for a current round winner. If there is one, nothing to do until the next round starts.
    if (board.winner !== null) {
        if (!betweenRounds) {
            betweenRounds = true;
            const winName: string = board.winner === 1 ? user1.displayName : user2.displayName;
            addToast(`${winName} won the round!`, "guessed", 6000);
            serverRows = -1;
            serverStolen = {1: false, 2: false};
            setRecoil(currentLetters, []);
            setRecoil(submittedRow, -1);
            scheduleRoundStart(createRound);
        }
        return;
    }
    betweenRounds = false;

    // Look for a new stolen state from either side to notify.
    if (board.user1.stolen && !serverStolen[1]) {
        serverStolen[1] = true;
        const stolenName = user1.displayName;
        addToast(`${stolenName} is stealing answers!`, "steal", 6000);
    }
    if (board.user2.stolen && !serverStolen[2]) {
        serverStolen[2] = true;
        const stolenName = user2.displayName;
        addToast(`${stolenName} is stealing answers!`, "steal", 6000);
    }

    // Look for a new authoratative row from the server to overwrite or optimistic / pending value.
    if (me.board!.serverCount > serverRows) {
        console.log("new server side row");
        setRecoil(currentLetters, []);
        setRecoil(submittedRow, -1);
        serverRows = me.board!.serverCount;
    }
}

export function addToast(message: string, category: string, durationMs: number) {
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

export function pruneToasts() {
  var tx = [...getRecoil(toasts)];
  // Assumes no premption.
  const now = new Date();
  var changed = false;
  for (var i = tx.length - 1; i >= 0; i--) {
    const t = tx[i];
    if (now.valueOf() - t.start.valueOf() > t.expires) {
      tx.splice(i, 1);
      changed = true;
    }
  }
  if (changed) {
    setRecoil(toasts, tx);
  }
}
var timerSetForRound = false;
function scheduleRoundStart(createRound: any) {
  if (!timerSetForRound) {
    timerSetForRound = true;
    setTimeout(async () => {
      console.log("Trying to start round");
      timerSetForRound = false;
      const gid = getRecoil(gameId)!;
      const backendGame = getRecoil(backendGameState) as BackendGame; // XXX fragile.
      await createRound(Id.fromString(gid), backendGame.round);
    }, 7000);
  }
}
