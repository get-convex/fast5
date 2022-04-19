import { useRecoilValue } from 'recoil';
import { gameState, userMe, userThem, gameName } from '../../lib/game/state';
import Keyboard from '../Keyboard/Keyboard';
import BoardSide from '../BoardSide/BoardSide';
import styles from './Board.module.scss';
import WaitingModal from '../WaitingModal/WaitingModal';

function Board() {
  const game = useRecoilValue(gameState);
  const me = useRecoilValue(userMe);
  const them = useRecoilValue(userThem);
  const gname = useRecoilValue(gameName);

  if (game?.board === null || me === null || them === null) {
    if (game?.ready) {
      return <div className="flex w-full">Get Ready!</div>;
    }
    if (game?.public) {
      return <WaitingModal />;
    } else {
      // TODO: This shows up briefly before playing a stranger.
      return (
        <div className="flex w-full">
          Share this game code with your friend: {gname?.toLocaleUpperCase()}
        </div>
      );
    }
  }

  let message = 'Get ready...';
  if (game?.winner !== null) {
    message = 'Game over!';
  }
  if (game?.round) {
    message = `Round: ${game?.round}`;
  }

  return (
    <div className={styles.root}>
      <div>
        <BoardSide
          isOverflow={game?.board.overflow}
          user={me}
          isWinner={game?.board.winner === me!.number}
        />
        <Keyboard />
      </div>
      <p className={styles.message}>{message}</p>
      <BoardSide
        isOverflow={game?.board.overflow}
        user={them}
        isWinner={game?.board.winner === them!.number}
      />
    </div>
  );
}

export default Board;
