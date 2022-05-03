import Divider from '../Divider/Divider';
import styles from './Instructions.module.scss';

function Instructions() {
  return (
    <div className={styles.root}>
      <h1>How to Play</h1>
      <Divider />
      <p>
        Fast5 is a word racing game. Play against a friend, or a friendly
        Internet strangers.
      </p>
      <p>
        Once the round starts, just start typing your guess, and then hit enter
        to submit it. Each time you guess a new letter found in the word, you
        get tally some points. When you place a letter in exactly the right
        spot, you tally even more. The first racer to guess the entire word
        correctly each round gets to claim their points and add them to their
        total game score.
      </p>
      <p>
        You can’t see exactly what letters the other person is guessing, but you
        can see how close they’re getting. If you start to get worried they’re
        going to win, you can spy on their answers by hitting the space bar!
        This will let you see both your letters and theirs, but the number of
        points you can win in that round will be cut in half.
      </p>
      <p>After 5 rounds, the racer with the most points wins!</p>
    </div>
  );
}

export default Instructions;
