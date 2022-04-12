import styles from './Instructions.module.scss';

function Instructions() {
  return (
    <div className={styles.root}>
      <h1>How to Play</h1>
      <p>
        Fast5 is a word racing game. Play against a friend, or a friendly
        Internet stranger!
      </p>
      <p>
        Once the round starts, just start typing your guess, and then hit enter
        to submit it. The first racer to guess the word each round adds some
        points to their total score. Guessing earlier gets you more points!
      </p>
      <p>
        You can’t see exactly what letters the other person is guessing, but you
        can see how close they’re getting. If you start to get worried they’re
        going to win, you can steal their answers by typing an exclamation
        point! This will let you see both your letters and theirs, but the
        number of points you can win in that round will be half as much as them.
      </p>
      <p>After 5 rounds, the racer with the most points wins!</p>
    </div>
  );
}

export default Instructions;
