import { useAuth0 } from '@auth0/auth0-react';
import classNames from 'classnames';
import Image from 'next/image';
import Button from '../Button/Button';
import styles from './Splash.module.scss';

function Splash() {
  let { loginWithRedirect } = useAuth0();

  return (
    <div className={styles.root}>
      <div className={classNames(styles.content)}>
        <div className="animate__animated animate__lightSpeedInLeft">
          <Image src="/logo.svg" width="600" height="300" alt="Fast5 logo" />
        </div>
        <span className="animate__animated animate__zoomIn animate__faster animate__delay-1s">
          The fastest word racing game in town
        </span>
        <Button
          onClick={loginWithRedirect}
          className="animate__animated animate__flipInX animate__faster animate__delay-2s"
        >
          Log in to play
        </Button>
      </div>
    </div>
  );
}

export default Splash;
