export function isAlpha(ch: string) {
  return typeof ch === 'string' && ch.length === 1 && /[A-Za-z]/.test(ch);
}

var debug = false;
export function enableDebugLogging() {
  debug = true;
}

export function dlog(...items: any[]) {
  if (debug) {
    var segs = [];
    for (const i of items) {
      if (typeof i === 'string') {
        segs.push(i);
      } else {
        segs.push(JSON.stringify(i));
      }
    }
    console.log(segs.join(' | '));
  }
}

export interface BoardSide {
  serverCount: number;
  rows: {
    score: number;
    active: boolean;
    cells: string[];
  }[];
  spying: boolean;
}

export function buildBoardSide(
  board: any,
  current: number,
  cell: number,
  letters: string[],
  submitted: number
): BoardSide {
  console.log(board, current, cell, letters, submitted);
  var rows = [];
  for (var i = 0; i < 6; i++) {
    var cells: string[] = [];
    if (board.guesses.length <= i) {
      if (current === i) {
        if (submitted > -1 && submitted == i - 1) {
          cells = ['??', '??', '??', '??', '??'];
        } else {
          for (var j = 0; j < 5; j++) {
            if (submitted === i) {
              cells.push('P' + letters[j]);
            } else if (letters.length > j) {
              cells.push('A' + letters[j]);
            } else if (cell === j) {
              cells.push('H?');
            } else {
              cells.push('A?');
            }
          }
        }
      } else {
        cells = ['??', '??', '??', '??', '??'];
      }
    } else {
      cells = board.guesses[i];
    }
    var row = { score: board.scores[i], active: false, cells: cells };
    rows.push(row);
  }
  return {
    serverCount: board.guesses.length,
    rows: rows,
    spying: board.spying,
  };
}
