import classNames from 'classnames';
import styles from './BoardCell.module.scss';

const styleForState: { [key: string]: string } = {
  '?': styles.unplayed,
  '0': styles.notFound,
  '1': styles.found,
  '2': styles.foundExact,
  A: styles.activeWord,
  H: styles.focused,
  P: styles.submitting,
};

type BoardCellProps = {
  // TODO: Consider a type like [Code, string] that is more restrictive, or
  // break this into multiple props.
  code: string;
  key: number;
};

function BoardCell({ code, key }: BoardCellProps) {
  // The code is a two-character string. The first character represents the
  // state of that tile, such as '0' if that letter does not exist in the word
  // or '2' if it's in the exact location. The second character represents the
  // letter to display on the tile, or `?` if it's an opponents tile.
  const tileState = code[0];
  const tileLetter = code[1] === '?' ? '' : code[1];

  return (
    <div
      key={key}
      className={classNames(styles.base, styleForState[tileState])}
    >
      {tileLetter}
    </div>
  );
}

export default BoardCell;
