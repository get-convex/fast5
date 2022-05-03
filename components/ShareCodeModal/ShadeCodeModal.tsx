import { useRecoilValue } from 'recoil';
import styles from './ShareCodeModal.module.scss';
import { gameName } from '../../lib/game/state';
import Modal from '../Modal/Modal';
import Divider from '../Divider/Divider';
import Button from '../Button/Button';
import { useState } from 'react';

function ShareCodeModal() {
  const [copied, setCopied] = useState(false);
  const code = useRecoilValue(gameName)?.toLocaleUpperCase();

  const handleCopyClicked = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
    }
  };

  return (
    <Modal open>
      <div className={styles.root}>
        Share this game code with your friend.
        <br />
        The game will begin as soon as they join!
        <Divider />
        <div className={styles.codeWrapper}>
          <span className={styles.code}>{code}</span>
          {/* TODO: Design calls for an icon here, unsure how to provide feedback that it's copied. */}
          <Button onClick={handleCopyClicked}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ShareCodeModal;
