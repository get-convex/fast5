import { Id } from '../../convex/_generated/dataModel';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useMutation, useQuery } from '../../convex/_generated/react';
import {
  gameId,
  gameOver,
  gameState,
  userMe,
  userThem,
} from '../../lib/game/state';
import Button from '../Button/Button';
import Instructions from '../Instructions/Instructions';
import GameSummary from '../GameSummary/GameSummary';
import LoginLogout from '../LoginLogout/LoginLogout';
import Modal from '../Modal/Modal';
import PlayerBar from '../PlayerBar/PlayerBar';
import styles from './Header.module.scss';

function Header() {
  const game = useRecoilValue(gameState);
  const me = useRecoilValue(userMe);
  const them = useRecoilValue(userThem);
  const gid = useRecoilValue(gameId);
  const gover = useRecoilValue(gameOver);
  const router = useRouter();
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const leaveGame = useMutation('leaveGame');
  const leaveAndGoHome = (e: Event) => {
    e.preventDefault();
    leaveGame({ gameId: new Id('games', gid!) });
    router.push('/');
  };
  const goHome = (e: Event) => {
    e.preventDefault();
    router.push('/');
  };

  // If we're in a game, show more details.
  if (game?.board && me && them) {
    return (
      <>
        <header className={styles.root}>
          <div className={styles.left}>
            <PlayerBar user={me} />
          </div>
          <div className={styles.center}>
            <div className={styles.buttonGroup}>
              <Button onClick={() => setInstructionsOpen(true)}>Help</Button>
              <Button onClick={leaveAndGoHome}>Exit</Button>
            </div>
          </div>
          <div className={styles.right}>
            <PlayerBar user={them} />
          </div>
        </header>
        <Modal open={instructionsOpen}>
          <div className={styles.instructions}>
            <Instructions />
            <Button onClick={() => setInstructionsOpen(false)}>Close</Button>
          </div>
        </Modal>
        <Modal open={gover}>
          <div className={styles.instructions}>
            <GameSummary />
            <Button onClick={(e) => goHome(e)}>Play Again</Button>
          </div>
        </Modal>
      </>
    );
  }

  // We're not in a game, show the default items.
  return (
    <>
      <header className={styles.root}>
        <div className={styles.left} />
        <div className={styles.center}>
          <Image src="/logo.svg" width="83" height="36" alt="Fast5 logo" />
        </div>
        <div className={styles.right}>
          <LoginLogout />
        </div>
      </header>
      <Modal open={instructionsOpen}>
        <div className={styles.instructions}>
          <Instructions />
          <Button onClick={() => setInstructionsOpen(false)}>Close</Button>
        </div>
      </Modal>
    </>
  );
}

export default Header;
