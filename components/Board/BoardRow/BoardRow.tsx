import classNames from 'classnames';
import BoardCell from '../BoardCell/BoardCell';
import styles from './BoardRow.module.scss';

function BoardRow(props: any) {
  var cells = [];
  for (var i = 0; i < 5; i++) {
    cells.push(BoardCell({ code: props.cells[i], key: i }));
  }

  var scoreClasses = ['flex-initial', 'w-16'];
  if (props.isWinner) {
    scoreClasses.push('text-green-500');
    var score = (
      <div className="flex-initial w-16 text-green-500">{props.score}</div>
    );
  } else if (props.isWrong) {
    scoreClasses.push('line-through');
    var score = (
      <div className="flex-initial w-16 line-through">{props.score}</div>
    );
  }

  return (
    <div
      key={`row-${props.key}`}
      className={classNames('flex w-1/8', styles.root)}
    >
      {cells}
      <div className={classNames(scoreClasses)}>{props.score}</div>
    </div>
  );
}

export default BoardRow;
