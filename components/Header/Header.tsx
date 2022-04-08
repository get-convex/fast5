import Image from 'next/image';
import LoginLogout from '../LoginLogout/LogInLogOut';
import styles from './Header.module.scss';

function Header() {
  return (
    <header className={styles.root}>
      <div className={styles.left} />
      <div className={styles.center}>
        <Image src="/logo.svg" width="83" height="36" alt="Fast5 logo" />
      </div>
      <div className={styles.right}>
        <LoginLogout />
      </div>
    </header>
  );
}

export default Header;
