import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore/lite';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { format } from 'date-fns';
import db from '../../services/firestoreConnection';
import { documentId } from 'firebase/firestore/lite';
import Head from 'next/head';
import { FiCalendar } from 'react-icons/fi';
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
            <time>{task[0].createdFormatted}</time>
          </div>
        </div>
        <p>{task[0].task}</p>
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

  if (!session?.id) {
    return {
      redirect: {
        destination: '/board',
        permanent: false,
      },
    };
  }

  const querySnapshot = await getDocs(
    query(collection(db, 'tasks'), where(documentId(), '==', id))
  );

  const data = JSON.stringify(
    querySnapshot.docs.map((snapshot) => ({
      id: snapshot.id,
      created: snapshot.data().created,
      createdFormatted: format(
        snapshot.data().created.toDate(),
        'dd MMMM yyyy'
      ),
      task: snapshot.data().task,
      userId: snapshot.data().userId,
      nome: snapshot.data().name,
    }))
  );

  console.log(data);

  return {
    props: { data },
  };
};
