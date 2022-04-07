import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import styles from './App.module.scss';

type AppProps = {
  children: React.ReactNode;
};

function App({ children }: AppProps) {
  return (
    <div className={styles.root}>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default App;
