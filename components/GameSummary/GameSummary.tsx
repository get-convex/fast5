import { useRecoilValue } from 'recoil';
import { gameState, gameWinner } from '../../lib/game/state';
import Divider from '../Divider/Divider';
import styles from './GameSummary.module.scss';

function GameSummary() {
  const game = useRecoilValue(gameState);
  const wininfo = useRecoilValue(gameWinner);
  const winString =
    (wininfo?.winner ?? null) === null
      ? "It's a tie!"
      : `${wininfo!.winner} won the game!`;
  const abString =
    game?.abandoned ?? false
      ? '(a player left the game and the game was forfeited)'
      : '';

  return (
    <div className={styles.root}>
      <h1>{winString}</h1>
      <Divider />
      {abString}
    </div>
  );
}

export default GameSummary;
