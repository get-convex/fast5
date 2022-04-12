import Image from 'next/image';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { gameState, userMe, userThem } from '../../lib/game/state';
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
      left: <PlayerBar user={me} />,
      center: (
        <div className={styles.buttonGroup}>
          {/* TODO: Icons instead of text for these. */}
          <Button onClick={() => setInstructionsOpen(true)}>Help</Button>
          {/* TODO: Make this work. */}
          <Button>Exit</Button>
        </div>
      ),
      right: <PlayerBar user={them} />,
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
