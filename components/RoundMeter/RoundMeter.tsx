import styles from './RoundMeter.module.scss';

type RoundMeterProps = {
  round: number;
};

function RoundMeter({ round }: RoundMeterProps) {
  const percentComplete = (round / 5) * 100;

  return (
    <div className={styles.root}>
      <div
        className={styles.bar}
        style={{
          backgroundImage: `linear-gradient(0deg,#47c45b 0%,#085f16 ${percentComplete}%,#331766 ${percentComplete}%,#331766 100%)`,
        }}
      />
      <div
        className={styles.label}
        style={{ bottom: `calc(${percentComplete}% - 26px)` }}
      >
        {round}
      </div>
    </div>
  );
}

export default RoundMeter;
