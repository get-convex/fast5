import styles from './Button.module.scss';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (event?: any) => void;
};

function Button({ children, onClick }: ButtonProps) {
  return (
    <button className={styles.root} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
