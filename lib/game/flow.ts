import { Id } from '@convex-dev/server';
import { create } from 'domain';
import { BackendGame, BackendRound } from './proto';
import {
  backendGameState,
  backendRoundState,
  BoardState,
  currentLetters,
  currentRow,
  gameId,
  GameState,
  gameState,
  submittedRow,
  Toast,
  toasts,
  User,
  userMe,
} from './state';
import { BoardSide, dlog, enableDebugLogging } from './util';

export async function boot(
  params: any,
  joinGame: any,
  setGameId: any,
  setGameName: any
) {
  // enableDebugLogging(); // hax
  const gamename: string = params['game'] as string;
  setGameName(gamename);
  const gid = await joinGame(gamename);
  dlog(`Got gid = ${gid}`);
  if (gid === null) {
    dlog('Failed to join game...');
  } else {
    setGameId(gid.toString());
  }
}

export function addToast(
  setToasts: any,
  message: string,
  category: string,
  durationMs: number
) {
  dlog('Add toast');
  setToasts((origTx: Toast[]) => {
    var tx = [...origTx];
    tx.splice(0, 0, {
      message: message,
      category: category,
      expires: durationMs,
      start: new Date(),
    });
    return tx;
  });
}

export function pruneToasts(origTx: any, setTx: any) {
  var tx = [...origTx];
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
    setTx(tx);
  }
}
