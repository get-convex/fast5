import Image from 'next/image';
import styles from './Footer.module.scss';

function Footer() {
  return (
    <footer className={styles.root}>
      Powered by{' '}
      <Image src="/convex.svg" width="94" height="17" alt="Convex logo" />
    </footer>
  );
}

export default Footer;
