import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import { gameState, userMe, userThem } from '../../lib/game/state';
import BoardSide from '../BoardSide/BoardSide';
import Keyboard from '../Keyboard/Keyboard';
import RoundMeter from '../RoundMeter/RoundMeter';
import ShareCodeModal from '../ShareCodeModal/ShadeCodeModal';
import WaitingModal from '../WaitingModal/WaitingModal';
import styles from './Board.module.scss';

function Board() {
  const game = useRecoilValue(gameState);
  const me = useRecoilValue(userMe);
  const them = useRecoilValue(userThem);

  if (game?.board === null || me === null || them === null) {
    if (game?.ready) {
      return (
        <div
          className={classNames(
            styles.getReady,
            'animate__animated animate__zoomIn animate__fast'
          )}
        >
          Get ready!
        </div>
      );
    }
    if (game?.public) {
      return <WaitingModal />;
    } else {
      // TODO: This shows up briefly before playing a stranger.
      return <ShareCodeModal />;
    }
  }

  let message = 'Get ready...';
  if (game?.winner !== null) {
    message = 'Game over!';
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
      {game?.round ? (
        <RoundMeter round={game.round} />
      ) : (
        <p className={styles.message}>{message}</p>
      )}
      <BoardSide
        isOverflow={game?.board.overflow}
        user={them}
        isWinner={game?.board.winner === them!.number}
      />
    </div>
  );
}

export default Board;
