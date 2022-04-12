import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import { User, userMe } from '../../lib/game/state';
import BoardRow from '../BoardRow/BoardRow';
import styles from './BoardSide.module.scss';

type BoardSideProps = {
  user: User;
  isWinner: boolean;
  isOverflow?: boolean;
};

function BoardSide({ user, isOverflow, isWinner }: BoardSideProps) {
  const currentUser = useRecoilValue(userMe);

  var rows = [];
  var scoreRow = isOverflow
    ? user.board!.serverCount
    : user.board!.serverCount - 1;
  for (var i = 0; i < 6; i++) {
    let row = user.board!.rows[i];
    const isWrong =
      i < scoreRow || (i === user.board!.serverCount - 1 && !isWinner);
    rows.push(
      BoardRow({
        cellCodes: row.cells,
        key: i,
        score: row.score,
        isWinner: isWinner && scoreRow == i,
        isWrong: isWrong,
        showScore: user.number === currentUser?.number,
      })
    );
  }

  return (
    <div className={classNames(styles.root, { [styles.winner]: isWinner })}>
      {rows}
    </div>
  );
}

export default BoardSide;
