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

  const userInfo = (
    <>
      <div>{user.displayName}</div>
      <div className={styles.stats}>
        (<span className={styles.wins}>{user.stats.wins}</span>-
        <span className={styles.losses}>{user.stats.losses}</span>-
        <span className={styles.ties}>{user.stats.ties}</span>)
      </div>
    </>
  );

  const score = (
    <>
      <div className={styles.scorebox}>{user.score}</div>
    </>
  );

  const pad = <div className={styles.padbox}></div>;

  const textElements =
    currentUser?.number === user.number
      ? [userInfo, pad, score]
      : [score, pad, userInfo];

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
      {textElements}
    </div>
  );
}

export default PlayerBar;
