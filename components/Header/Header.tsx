import { Id } from 'convex-dev/values';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useMutation } from '../../convex/_generated';
import { gameId, gameState, userMe, userThem } from '../../lib/game/state';
import Button from '../Button/Button';
import Instructions from '../Instructions/Instructions';
import LoginLogout from '../LoginLogout/LoginLogout';
import Modal from '../Modal/Modal';
import PlayerBar from '../PlayerBar/PlayerBar';
import styles from './Header.module.scss';

function Header() {
  const game = useRecoilValue(gameState);
  const me = useRecoilValue(userMe);
  const them = useRecoilValue(userThem);
  const gid = useRecoilValue(gameId);
  const router = useRouter();
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const leaveGame = useMutation('leaveGame');
  const leaveAndGoHome = (e: Event) => {
    e.preventDefault();
    leaveGame(Id.fromString(gid!));
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
