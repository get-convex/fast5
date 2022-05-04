import styles from './Button.module.scss';

type ButtonProps = {
  children: React.ReactNode;
  type?: 'submit' | 'button';
  onClick?: (event?: any) => void;
};

function Button({ children, onClick, type = 'button' }: ButtonProps) {
  return (
    <button className={styles.root} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

export default Button;
