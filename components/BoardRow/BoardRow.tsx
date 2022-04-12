import classNames from 'classnames';
import BoardCell from '../BoardCell/BoardCell';
import styles from './BoardRow.module.scss';

type BoardRowProps = {
  cellCodes: string[];
  isWinner: boolean;
  isWrong: boolean;
  key: number;
  score: number;
  showScore: boolean;
};

function BoardRow({
  cellCodes,
  key,
  score,
  isWrong,
  isWinner,
  showScore,
}: BoardRowProps) {
  var cells = [];
  for (var i = 0; i < 5; i++) {
    cells.push(BoardCell({ code: cellCodes[i], key: i }));
  }

  return (
    <div key={`row-${key}`} className={classNames('flex w-1/8', styles.root)}>
      {cells}
      {showScore && (
        <div
          className={classNames(styles.score, {
            [styles.scoreWrong]: isWrong,
            [styles.scoreRight]: isWinner,
          })}
        >
          {score}
        </div>
      )}
    </div>
  );
}

export default BoardRow;
