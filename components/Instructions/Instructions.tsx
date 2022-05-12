import Divider from '../Divider/Divider';
import styles from './Instructions.module.scss';

function Instructions() {
  return (
    <div className={styles.root}>
      <h1>How to Play</h1>
      <Divider />
      <p>
        Fast5 is a guess-the-word racing game, in loving tribute to wordle. Play
        against a friend, or a friendly Internet stranger.
      </p>
      <p>
        To play, when each round starts, just type your first guess and hit
        enter. For each new letter in your guess that exists in the secret word
        (a "yellow" letter) you collect some round points. If you place the
        correct letter in exactly the right spot in the word (a "green" letter)
        you collect even more.
      </p>
      <p>
        Use the matching letters from each guess to improve your next move. The
        first racer to guess the entire word correctly gets to keep their round
        points, and so they get added to their total game score. Be careful,
        though! If you run out of guesses without finding the word, your
        opponent wins the round.
      </p>
      <p>
        Now normally, you can’t see exactly which letters the other person is
        guessing. But you can see their matching tiles, and accordingly can tell
        how close they’re getting to the correct word. If you start to get
        worried they’re going to win, you can <i>spy</i> on their answers by
        hitting the space bar. This will allow you to see both your letters and
        theirs, and provide a lot more information about the secret word but
        your round points will halved, so your reward is smaller if you guess
        correctly.
      </p>
      <p>After five rounds, the racer with the most points wins. Good luck!</p>
    </div>
  );
}

export default Instructions;
