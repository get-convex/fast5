import classNames from 'classnames';

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
  if (code[1] !== '?') {
    var char = code[1] as string;
  } else {
    var char = '';
  }

  const tileState = code[0];
  const tileLetter = code[1] === '?' ? '' : code[1];

  var cellClasses = ['rounded', 'm-1', 'flex-auto', 'text-2xl', 'text-center'];
  if (tileState === '?') {
    cellClasses.push('bg-gray-200');
  } else if (tileState === '0') {
    cellClasses.push('bg-gray-400');
  } else if (tileState === '1') {
    cellClasses.push('bg-yellow-400');
  } else if (tileState === '2') {
    cellClasses.push('bg-green-400');
  } else if (tileState === 'A') {
    cellClasses.push('bg-gray-100');
  } else if (tileState === 'H') {
    cellClasses.push('bg-amber-100');
  } else if (tileState === 'P') {
    cellClasses.push('bg-sky-100', 'shadow-md', 'text-gray-600');
  } else {
    throw 'unknown cell formatting code';
  }

  return (
    <div key={key} className={classNames(cellClasses)}>
      {tileLetter}
    </div>
  );
}

export default BoardCell;
