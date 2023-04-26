import classNames from 'classnames';
import { Id } from '../../convex/_generated/dataModel';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useMutation } from '../../convex/_generated/react';
import { addToast } from '../../lib/game/flow';
import {
  canEdit,
  currentLetters,
  gameId,
  keyboardUsedState,
  submittedRow,
  toasts,
} from '../../lib/game/state';
import styles from './Keyboard.module.scss';

type KeyboardProps = {};

function Keyboard({}: KeyboardProps) {
  const letterStates: Map<string, '0' | '1' | '2' | '3' | '4'> =
    useRecoilValue(keyboardUsedState);
  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE'],
  ];

  const gameIdValue = useRecoilValue(gameId);
  const canEditValue = useRecoilValue(canEdit);
  const [currentLettersValue, setCurrentLetters] =
    useRecoilState(currentLetters);
  const [, setSubmittedRow] = useRecoilState(submittedRow);
  const [, setToasts] = useRecoilState(toasts);
  const guessWord = useMutation('guessWord');
  const spy = useMutation('spy');

  const handleKeyPress = (key: string) => {
    if (!canEditValue) {
      return;
    }

    if (key === 'ENTER') {
      const tryGuess = async () => {
        const tryWord = currentLettersValue.join('');
        const validGuess = await guessWord({
          gameId: new Id('games', gameIdValue!),
          word: tryWord,
        });
        if (!validGuess) {
          addToast(setToasts, `Invalid word '${tryWord}'`, 'error', 5000);
          setSubmittedRow(-1);
          setCurrentLetters([]);
        }
      };

      if (currentLettersValue.length === 5) {
        tryGuess();
      }
      return;
    }

    if (key === 'DELETE') {
      setCurrentLetters(currentLettersValue.slice(0, -1));
      return;
    }

    if (key === 'SPACE') {
      const doSpy = async () => {
        if (gameIdValue !== null) {
          await spy({ gameId: new Id('games', gameIdValue) });
        }
      };
      doSpy();
      return;
    }

    setCurrentLetters([...currentLettersValue, key]);
  };

  return (
    <div className={styles.root}>
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((letter) => {
            const state = letterStates.get(letter);
            return (
              <button
                key={letter}
                className={classNames(styles.key, {
                  [styles.keyWide]: letter.length > 1,
                  [styles.keyLetterNotFound]: state === '0',
                  [styles.keyLetterFound]: state === '1' || state === '3',
                  [styles.keyLetterCorrect]: state === '2' || state === '4',
                })}
                onClick={() => handleKeyPress(letter)}
              >
                {letter === 'DELETE' ? '←' : letter}
              </button>
            );
          })}
        </div>
      ))}
      <button
        className={classNames(styles.key, styles.keySpacebar)}
        onClick={() => handleKeyPress('SPACE')}
      >
        SPACEBAR TO SPY
      </button>
    </div>
  );
}

export default Keyboard;
