import { ReactMutation } from 'convex/react';
import { API } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { addToast } from './flow';

export const ALL_KEYS = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'Backspace',
  'Enter',
  ' ',
];

export function handleGameInput(
  guessWord: ReactMutation<API, 'guessWord'>,
  spy: ReactMutation<API, 'spy'>,
  gid: any,
  canEdit: any,
  currentLetters: any,
  setCurrentLetters: any,
  currentRow: any,
  setSubmittedRow: any,
  setToasts: any
) {
  return (event: KeyboardEvent) => {
    if (
      (event.keyCode >= 65 && event.keyCode <= 90) ||
      (event.keyCode >= 97 && event.keyCode <= 122)
    ) {
      const letter = event.key.toLocaleUpperCase();
      if (canEdit) {
        setCurrentLetters((letters: string[]) => {
          var letters = [...letters];
          if (letters.length === 5) {
            return letters;
          }
          letters.push(letter);
          return letters;
        });
      }
    } else if (event.key === 'Backspace') {
      if (canEdit) {
        setCurrentLetters((letters: string[]) => {
          var letters = letters.slice(0, -1);
          return letters;
        });
      }
    } else if (event.key === 'Enter') {
      if (canEdit && currentLetters.length === 5) {
        setSubmittedRow(currentRow as number);
        let letters = currentLetters;
        const tryGuess = async () => {
          let tryWord = letters.join('');
          let validGuess = await guessWord({
            gameId: new Id('games', gid!),
            word: tryWord,
          });
          if (!validGuess) {
            addToast(setToasts, `Invalid word '${tryWord}'`, 'error', 5000);
            setSubmittedRow(-1);
            setCurrentLetters([]);
          }
        };
        tryGuess();
      }
    } else if (event.key === ' ') {
      event.preventDefault();
      const doSpy = async () => {
        if (gid !== null) {
          await spy({ gameId: new Id('games', gid) });
        }
      };
      if (canEdit) {
        doSpy();
      }
    }
  };
}
