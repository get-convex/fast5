import classNames from 'classnames';
import { useRecoilState } from 'recoil';
import { useIntervalWhen } from 'rooks';
import { pruneToasts } from '../../lib/game/flow';
import { toasts } from '../../lib/game/state';

function Toasts() {
  const [tx, setTx] = useRecoilState(toasts);

  useIntervalWhen(
    () => {
      pruneToasts(tx, setTx);
    },
    1000,
    true
  );

  var tels = [];
  var i = 0;
  for (const t of tx) {
    i += 1;
    var outerClass = [
      'flex',
      'items-center',
      'm-2',
      'p-2',
      'space-x-4',
      'w-full',
      'max-w-xs',
      'text-gray-500',
      'bg-white',
      'rounded-lg',
      'divide-x',
      'divide-gray-200',
      'shadow',
      'dark:text-gray-800',
      'dark:divide-gray-700',
      'space-x',
    ];
    var innerClass = [
      'inline-flex',
      'flex-shrink-0',
      'justify-center',
      'items-center',
      'w-8',
      'h-8',
      'rounded-lg',
    ];

    var key = `toast-${i}`;
    if (t.category === 'guessed') {
      var oc = classNames(outerClass, ['dark:bg-green-200']);
      var ic = classNames(
        innerClass,
        'text-orange-500 bg-orange-100 dark:bg-orange-700 dark:text-orange-200'
      );
      var icon = (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
          ></path>
        </svg>
      );
    } else if (t.category === 'spy') {
      var oc = classNames(outerClass, ['dark:bg-yellow-200']);
      var ic = classNames(
        innerClass,
        'text-orange-500 bg-orange-100 dark:bg-blue-700 dark:text-orange-200'
      );
      var icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          {' '}
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />{' '}
          <path
            fillRule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clipRule="evenodd"
          />{' '}
        </svg>
      );
    } else if (t.category === 'error') {
      var oc = classNames(outerClass, ['dark:bg-red-200']);
      var ic = classNames(
        innerClass,
        'text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200'
      );
      var icon = (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      );
    } else {
      throw 'unknown toast category';
    }
    tels.push(
      <div key={key} className={oc} role="alert">
        <div className={ic}>{icon}</div>
        <div className="pl-4 text-sm font-normal">{t.message}</div>
      </div>
    );
  }
  return <div className="flex">{tels}</div>;
}

export default Toasts;
