import classNames from 'classnames';
import { User } from '../../../lib/game/state';
import BoardRow from '../BoardRow/BoardRow';
import styles from './BoardSide.module.scss';

function Board(props: any) {
  const user: User = props.user as User;
  var rows = [];
  var scoreRow = props.isOverflow
    ? user.board!.serverCount
    : user.board!.serverCount - 1;
  for (var i = 0; i < 6; i++) {
    let row = user.board!.rows[i];
    const isWrong =
      i < scoreRow || (i === user.board!.serverCount - 1 && !props.isWinner);
    rows.push(
      BoardRow({
        cells: row.cells,
        key: i,
        score: row.score,
        isWinner: props.isWinner && scoreRow == i,
        isWrong: isWrong,
      })
    );
  }

  return (
    <div
      className={classNames(styles.root, { [styles.winner]: props.isWinner })}
    >
      {rows}
    </div>
  );
}

export default Board;
