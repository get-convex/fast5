import { useAuth0 } from '@auth0/auth0-react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Button from '../components/Button/Button';
import Divider from '../components/Divider/Divider';
import Modal from '../components/Modal/Modal';
import { useConvex } from '../convex/_generated/react';
import styles from './join.module.scss';

const Home: NextPage = () => {
  const [game, setGame] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const convex = useConvex();
  let { isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      convex.clearAuth();
      router.push('/');
    }
  }, [isAuthenticated, isLoading, convex, router]);

  const handleTextChange = (f: any) => {
    return (e: any) => {
      setError('');
      e.preventDefault();
      f(e.target.value);
    };
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const validateAndGo = async () => {
      // TODO -- need better support for one-offs from react-convex land.
      const watch = convex.watchQuery('validateGame', { gameName: game });
      watch.onUpdate(() => {
        const err = watch.localQueryResult();
        if (typeof err === 'string') {
          setError(`Error joining game: ${err}`);
        } else {
          router.push(`game/${game.toLocaleLowerCase().trim()}`);
        }
      });
    };
    validateAndGo();
  };

  return (
    <div>
      <Modal open>
        <form onSubmit={handleSubmit} className={styles.root}>
          <div className={styles.title}>Join your friend&rsquo;s game</div>
          <Divider />
          <input
            className={styles.codeInput}
            placeholder="Enter game code"
            value={game}
            onChange={handleTextChange(setGame)}
          />
          {error && <div className={styles.error}>{error}</div>}
          <Button type="submit">Join Game</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Home;
