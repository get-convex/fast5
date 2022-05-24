import 'animate.css';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Modal from '../Modal/Modal';
import styles from './App.module.scss';

type AppProps = {
  children: React.ReactNode;
};

function App({ children }: AppProps) {
  return (
    <>
      <div className={styles.root}>
        <Header />
        {children}
        <Footer />
      </div>
      <Modal className={styles.modal} open>
        <div className={styles.modalContent}>
          Fast5 is not yet playable on mobile devices, and even on desktop
          requires a sizeable browser window. Please increase the size of your
          browser window, or try again from a device with a larger screen.
        </div>
      </Modal>
    </>
  );
}

export default App;
