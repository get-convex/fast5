import classNames from 'classnames';
import styles from './Modal.module.scss';

type ModalProps = {
  children: React.ReactNode;
  open: boolean;
};

function Modal({ children, open = false }: ModalProps) {
  return (
    <div className={classNames(styles.root, { [styles.closed]: !open })}>
      <div className={styles.modal}>{children}</div>
    </div>
  );
}

export default Modal;
