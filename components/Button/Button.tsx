import classNames from 'classnames';
import styles from './Button.module.scss';

type ButtonProps = {
  children: React.ReactNode;
  type?: 'submit' | 'button';
  onClick?: (event?: any) => void;
  className?: string;
};

function Button({
  children,
  onClick,
  type = 'button',
  className,
}: ButtonProps) {
  return (
    <button
      className={classNames(styles.root, className)}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;
