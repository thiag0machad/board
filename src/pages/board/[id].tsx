import { format } from 'date-fns';
import { doc, getDoc } from 'firebase/firestore/lite';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import { FiCalendar } from 'react-icons/fi';
import { db } from '../../services/firebaseConnection';
import styles from './task.module.scss';

type Task = {
  id: string;
  created: string | Date;
  createdFormatted?: string;
  task: string;
  userId: string;
  name: string;
};

interface TaskListProps {
  data: string;
}

export default function Task({ data }: TaskListProps) {
  const task = JSON.parse(data) as Task;

  return (
    <>
      <Head>
        <title>Detalhes da sua tarefa</title>
      </Head>
      <article className={styles.container}>
        <div className={styles.actions}>
          <div>
            <FiCalendar size={30} color='#fff' />
            <span>Tarefa criada:</span>
            <time>{task.createdFormatted}</time>
          </div>
        </div>
        <p>{task.task}</p>
      </article>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { id } = params;
  const session = await getSession({ req });

  if (!session?.vip) {
    return {
      redirect: {
        destination: '/board',
        permanent: false,
      },
    };
  }
  const docRef = doc(db, 'tasks', String(id));
  const data = await getDoc(docRef)
    .then((snapshot) => {
      const data = {
        id: snapshot.id,
        created: snapshot.data().created,
        createdFormatted: format(
          snapshot.data().created.toDate(),
          'dd MMMM yyyy'
        ),
        task: snapshot.data().task,
        userId: snapshot.data().userId,
        nome: snapshot.data().name,
      };

      return JSON.stringify(data);
    })
    .catch(() => {
      return {};
    });

  if (Object.keys(data).length === 0) {
    return {
      redirect: {
        destination: '/board',
        permanent: false,
      },
    };
  }

  return {
    props: { data },
  };
};
