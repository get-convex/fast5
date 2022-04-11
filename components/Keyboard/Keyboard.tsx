import styles from './Keyboard.module.scss';
import { useRecoilValue } from 'recoil';
import { keyboardUsedState } from '../../lib/game/state';
import classNames from 'classnames';

type KeyboardProps = {};

function Keyboard({}: KeyboardProps) {
  const letterStates: Map<string, '0' | '1' | '2'> =
    useRecoilValue(keyboardUsedState);
  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE'],
  ];

  console.log('Keyboard (new) -> render', { letterStates });
  return (
    <div className={styles.root}>
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((letter) => {
            const state = letterStates.get(letter);
            // TODO: Make these buttons work as an alternative to the keyboard.
            console.log({ letterStates, letter });
            return (
              <button
                key={letter}
                className={classNames(styles.key, {
                  [styles.keyWide]: letter.length > 1,
                  [styles.keyLetterNotFound]: state === '0',
                  [styles.keyLetterFound]: state === '1' || state === '2',
                })}
              >
                {letter === 'DELETE' ? '←' : letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
