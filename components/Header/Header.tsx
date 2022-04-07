import Image from 'next/image';
import styles from './Header.module.scss';

function Header() {
  return (
    <header className={styles.root}>
      <Image src="/logo.svg" width="83" height="36" alt="Fast5 logo" />
    </header>
  );
}

export default Header;
