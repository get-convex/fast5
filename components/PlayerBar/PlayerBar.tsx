import classNames from 'classnames';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { User, userMe } from '../../lib/game/state';
import styles from './PlayerBar.module.scss';

type PlayerBarProps = {
  user?: User;
};

function PlayerBar({ user }: PlayerBarProps) {
  const currentUser = useRecoilValue(userMe);

  if (!user) {
    return null;
  }

  console.log('PlayerBar', { user });

  return (
    <div
      className={classNames(styles.root, {
        [styles.reverse]: currentUser?.number !== user.number,
      })}
    >
      <div className={styles.avatar}>
        <img
          src={user.photoUrl}
          width="36"
          height="36"
          alt={`Avatar of ${name}`}
          referrerPolicy="no-referrer"
        />
      </div>
      {user.displayName} | {user.score} points
    </div>
  );
}

export default PlayerBar;
