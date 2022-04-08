import { useRouter } from 'next/router';
import { useMutation } from '../../convex/_generated';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import styles from './StartGame.module.scss';

function StartGame() {
  const router = useRouter();
  const createGame = useMutation('createGame');
  const createOrJoinRandom = useMutation('createOrJoinRandom');

  const handleCreateGame = (e: any) => {
    e.preventDefault();
    const go = async () => {
      const gameName = await createGame();
      router.push(`game/${gameName}`);
    };
    go();
  };

  const handleJoinGame = (e: any) => {
    e.preventDefault();
    const go = async () => {
      router.push(`join`);
    };
    go();
  };

  const handleRandom = (e: any) => {
    e.preventDefault();
    const go = async () => {
      const gameName = await createOrJoinRandom();
      router.push(`game/${gameName}`);
    };
    go();
  };

  return (
    <Modal>
      <div className={styles.instructions}>
        <p>
          Fast5 is a word racing game. Play against a friend, or a friendly
          Internet stranger!
        </p>
        <p>
          Once the round starts, just start typing your guess, and then hit
          enter to submit it. The first racer to guess the word each round adds
          some points to their total score. Guessing earlier gets you more
          points!
        </p>
        <p>
          You can’t see exactly what letters the other person is guessing, but
          you can see how close they’re getting. If you start to get worried
          they’re going to win, you can steal their answers by typing an
          exclamation point! This will let you see both your letters and theirs,
          but the number of points you can win in that round will be half as
          much as them.
        </p>
        <p>After 5 rounds, the racer with the most points wins!</p>
      </div>
      <div className={styles.actions}>
        <Button onClick={handleCreateGame}>
          Create a Game to Play a Friend
        </Button>
        <Button onClick={handleJoinGame}>Join a Friend&rsquo;s Game</Button>
        <Button onClick={handleRandom}>
          Play a Friendly Internet Stranger
        </Button>
      </div>
    </Modal>
  );
}

export default StartGame;
