import styles from './styles.module.scss';
import Link from 'next/link';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href='/'>
          <img src='/images/logo.svg' alt='Logo Board' />
        </Link>
        <nav>
          <Link href='/'>
            <a>Home</a>
          </Link>
          <Link href='/board'>
            <a>Meu board</a>
          </Link>
        </nav>

        <button>Entrar com GitHub</button>
      </div>
    </header>
  );
}
