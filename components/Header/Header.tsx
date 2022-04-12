import Image from 'next/image';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { gameState } from '../../lib/game/state';
import Button from '../Button/Button';
import Instructions from '../Instructions/Instructions';
import LoginLogout from '../LoginLogout/LoginLogout';
import Modal from '../Modal/Modal';
import styles from './Header.module.scss';

function Header() {
  const game = useRecoilValue(gameState);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  // If we're not in a game, show the login/logout button.
  let content = {
    left: <></>,
    center: <Image src="/logo.svg" width="83" height="36" alt="Fast5 logo" />,
    right: <LoginLogout />,
  };

  // If we're in a game, show more details.
  if (game !== null) {
    content = {
      left: <p>TODO: Player</p>,
      center: (
        <div className={styles.buttonGroup}>
          {/* TODO: Icons instead of text for these. */}
          <Button onClick={() => setInstructionsOpen(true)}>Help</Button>
          <Button>Exit</Button>
        </div>
      ),
      right: <p>TODO: Opponent</p>,
    };
  }

  console.log('Header', { game });

  return (
    <>
      <header className={styles.root}>
        <div className={styles.left}>{content.left}</div>
        <div className={styles.center}>{content.center}</div>
        <div className={styles.right}>{content.right}</div>
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
