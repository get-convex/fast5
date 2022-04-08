import Image from 'next/image';
import styles from './Footer.module.scss';

function Footer() {
  return (
    <footer className={styles.root}>
      <div className={styles.rockWrapper}>
        <Image src="/rock.png" alt="" width="130" height="130" />
      </div>
      <span className={styles.credit}>
        Powered by{' '}
        <Image src="/convex.svg" width="94" height="17" alt="Convex logo" />
      </span>
      <div className={styles.rockWrapper}>
        <Image src="/rock.png" alt="" width="130" height="130" />
      </div>
    </footer>
  );
}

export default Footer;
