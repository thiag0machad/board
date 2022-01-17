import styles from '../styles/styles.module.scss';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';
import { db } from '../services/firebaseConnection';
import { useState } from 'react';

type Data = {
  id: string;
  donate: boolean;
  lastDonate: Date;
  image: string;
};
interface HomeProps {
  data: string;
}

export default function Home({ data }: HomeProps) {
  const [donaters, setDonaters] = useState<Data[]>(JSON.parse(data));

  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas.</title>
      </Head>
      <main className={styles.contentContainer}>
        <img src='/images/board-user.svg' alt='Ferramenta board' />

        <section className={styles.callToAction}>
          <h1>
            Uma ferramenta para seu dia a dia Escreva, planeje e organize-se...
          </h1>
          <p>
            <span>100% Gratuita</span> e online.
          </p>
        </section>

        {donaters.length !== 0 && <h3>Apoiadores:</h3>}
        <div className={styles.donaters}>
          {donaters.map((donater) => (
            <img key={donater.image} src={donater.image} alt={donater.id} />
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const querySnapshot = await getDocs(
    query(collection(db, 'users'), where('donate', '==', true))
  );

  const data = JSON.stringify(
    querySnapshot.docs.map((snapshot) => ({
      id: snapshot.id,
      ...snapshot.data(),
    }))
  );

  return {
    props: { data },
    revalidate: 60 * 60,
  };
};
