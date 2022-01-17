import { collection, getDocs } from 'firebase/firestore/lite';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';
import { db } from '../services/firebaseConnection';
import styles from '../styles/styles.module.scss';

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
        <Image
          src='/images/board-user.svg'
          alt='Ferramenta board'
          width={450}
          height={450}
        />

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
            <div key={donater.image}>
              <Image
                src={donater.image}
                alt={donater.id}
                width={65}
                height={65}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const querySnapshot = await getDocs(collection(db, 'users'));

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
