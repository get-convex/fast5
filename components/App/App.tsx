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
        Fast5 is not yet playable on mobile devices. Please try again from a
        larger screen.
      </Modal>
    </>
  );
}

export default App;
