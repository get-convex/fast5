import classNames from 'classnames';
import Confetti from 'react-confetti';
import { useRecoilValue } from 'recoil';
import {
  backendGameState,
  backendRoundState,
  User,
  userMe,
} from '../../lib/game/state';
import BoardRow from '../BoardRow/BoardRow';
import styles from './BoardSide.module.scss';

type BoardSideProps = {
  user: User;
  isWinner: boolean;
  isOverflow?: boolean;
};

function BoardSide({ user, isOverflow, isWinner }: BoardSideProps) {
  const currentUserValue = useRecoilValue(userMe);
  const roundStateValue = useRecoilValue(backendRoundState);
  const backendGameValue = useRecoilValue(backendGameState);

  var rows = [];
  var scoreRow = isOverflow
    ? user.board!.serverCount
    : user.board!.serverCount - 1;
  for (var i = 0; i < 6; i++) {
    let row = user.board!.rows[i];
    const isWrong = false;
    //    const isWrong =
    //     i < scoreRow || (i === user.board!.serverCount - 1 && !isWinner);
    rows.push(
      BoardRow({
        cellCodes: row.cells,
        key: i,
        score: row.score,
        isWinner: isWinner && scoreRow == i,
        isWrong: isWrong,
        showScore: user.number === currentUserValue?.number,
      })
    );
  }

  // Are we playing as user1 or user2?
  const currentUserSpying =
    (backendGameValue?.user1.isYou && roundStateValue?.user1?.spying) ||
    (backendGameValue?.user2.isYou && roundStateValue?.user2?.spying);

  return (
    <div
      className={classNames(styles.root, {
        BoardSide_opponent: user !== currentUserValue,
        BoardSide_spying: currentUserSpying,
      })}
    >
      {isWinner && (
        <div className={styles.confetti}>
          <Confetti
            numberOfPieces={1000}
            recycle={false}
            width={window.innerWidth / 2}
            height={window.innerHeight}
          />
        </div>
      )}

      {rows}
    </div>
  );
}

export default BoardSide;
