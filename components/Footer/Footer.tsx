import Image from 'next/image';
import styles from './Footer.module.scss';

// TODO: This should be a link to the Convex showcase page.
function Footer() {
  return (
    <footer className={styles.root}>
      <a href="https://convex.dev/">
        Built on{' '}
        <Image src="/convex.svg" width="94" height="17" alt="Convex logo" />
      </a>
    </footer>
  );
}

export default Footer;
