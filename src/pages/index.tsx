import styles from '../styles/styles.module.scss';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas.</title>
      </Head>
      <div>
        <h1 className={styles.title}>
          Board App<span>NextJS</span>
        </h1>
      </div>
    </>
  );
}
