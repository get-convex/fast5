import styles from './Modal.module.scss';

type ModalProps = {
  children: React.ReactNode;
};

function Modal({ children }: ModalProps) {
  return (
    <div className={styles.root}>
      <div className={styles.modal}>{children}</div>
    </div>
  );
}

export default Modal;
