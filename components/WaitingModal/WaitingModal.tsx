import Divider from '../Divider/Divider';
import Modal from '../Modal/Modal';
import Spinner from '../Spinner/Spinner';
import styles from './WaitingModal.module.scss';

function WaitingModal() {
  return (
    <Modal open>
      <div className={styles.root}>
        Waiting for a friendly internet stranger
        <Divider />
        <Spinner />
      </div>
    </Modal>
  );
}

export default WaitingModal;
