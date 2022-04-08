import { useRouter } from 'next/router';
import { useMutation } from '../../convex/_generated';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';

function StartGame() {
  const router = useRouter();
  const createGame = useMutation('createGame');
  const createOrJoinRandom = useMutation('createOrJoinRandom');

  const handleCreateGame = (e: any) => {
    e.preventDefault();
    const go = async () => {
      const gameName = await createGame();
      router.push(`game/${gameName}`);
    };
    go();
  };

  const handleJoinGame = (e: any) => {
    e.preventDefault();
    const go = async () => {
      router.push(`join`);
    };
    go();
  };

  const handleRandom = (e: any) => {
    e.preventDefault();
    const go = async () => {
      const gameName = await createOrJoinRandom();
      router.push(`game/${gameName}`);
    };
    go();
  };

  return (
    <Modal>
      <div className="flex my-2">
        <Button onClick={handleCreateGame}>
          Create a Game to Play a Friend
        </Button>
      </div>
      <div className="flex my-2">
        <Button onClick={handleJoinGame}>Join a Friend&rsquo;s Game</Button>
      </div>
      <div className="flex my-2">
        <Button onClick={handleRandom}>
          Play a Friendly Internet Stranger
        </Button>
      </div>
    </Modal>
  );
}

export default StartGame;
