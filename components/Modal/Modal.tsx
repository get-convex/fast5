import classNames from 'classnames';
import styles from './Modal.module.scss';

type ModalProps = {
  children: React.ReactNode;
  open: boolean;
  className?: string;
};

function Modal({ children, open = false, className }: ModalProps) {
  return (
    <div className={classNames(styles.root, { [styles.closed]: !open })}>
      <div className={classNames(styles.modal, className)}>{children}</div>
    </div>
  );
}

export default Modal;
