import { useRecoilValue } from 'recoil';
import { gameState, userMe, userThem, gameName } from '../../lib/game/state';
import Keyboard from '../Keyboard/Keyboard';
import BoardSide from '../BoardSide/BoardSide';
import styles from './Board.module.scss';

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
      return (
        <div className="flex w-full">
          Waiting for a friendly Internet stranger...
        </div>
      );
    } else {
      return (
        <div className="flex w-full">
          Share this game code with your friend: {gname?.toLocaleUpperCase()}
        </div>
      );
    }
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
      <BoardSide
        isOverflow={game?.board.overflow}
        user={them}
        isWinner={game?.board.winner === them!.number}
      />
    </div>
  );
}

export default Board;
