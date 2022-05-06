import { useAuth0 } from '@auth0/auth0-react';
import { useRouter } from 'next/router';
import { useMutation } from '../../convex/_generated';
import Button from '../Button/Button';
import Instructions from '../Instructions/Instructions';
import Modal from '../Modal/Modal';
import Spinner from '../Spinner/Spinner';
import styles from './StartGame.module.scss';

function StartGame() {
  const router = useRouter();
  const createGame = useMutation('createGame');
  const createOrJoinRandom = useMutation('createOrJoinRandom');
  let { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

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

  // TODO: If no user (signed out) show sign in button instead of start game options.

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Modal open>
      <Instructions />
      <form className={styles.actions}>
        {isAuthenticated ? (
          <>
            <Button onClick={handleCreateGame}>
              Create a Game to Play a Friend
            </Button>
            <Button onClick={handleJoinGame}>Join a Friend&rsquo;s Game</Button>
            <Button onClick={handleRandom}>
              Play a Friendly Internet Stranger
            </Button>
          </>
        ) : (
          <Button onClick={loginWithRedirect}>Log in to play</Button>
        )}
      </form>
    </Modal>
  );
}

export default StartGame;
