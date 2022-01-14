import Head from 'next/head';
import { FiPlus, FiCalendar, FiEdit, FiTrash, FiClock } from 'react-icons/fi';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  getFirestore,
} from 'firebase/firestore/lite';
import { format } from 'date-fns';
import Link from 'next/link';
import styles from './styles.module.scss';
import firebaseApp from '../../services/firebaseConnection';
import { SupportButton } from '../../components/SupportButton';
import React from 'react';

type TaskList = {
  id: string;
  created: string | Date;
  createdFormatted?: string;
  task: string;
  userId: string;
  name: string;
};
interface BoardProps {
  user: {
    id: string;
    name: string;
  };
  data: string;
}

export default function Board({ user, data }: BoardProps) {
  const [input, setInput] = useState('');
  const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));

  async function handleAddTask(event: FormEvent) {
    event.preventDefault();

    if (input === '') {
      alert('Preencha alguma tarefa!');
      return;
    }

    const db = getFirestore(firebaseApp);

    await addDoc(collection(db, 'tasks'), {
      created: new Date(),
      task: input,
      userId: user.id,
      name: user.name,
    })
      .then((document) => {
        console.log('CADASTRADO COM SUCESSO!');

        const data = {
          id: document.id,
          created: new Date(),
          createdFormatted: format(new Date(), 'dd MMMM yyyy'),
          task: input,
          userId: user.id,
          name: user.name,
        };
        setTaskList([...taskList, data]);
        setInput('');
      })
      .catch((error) => {
        console.log('ERRO AO CADASTRAR: ', error);
      });
  }

  return (
    <>
      <Head>
        <title>Minhas Tarefas - Board</title>
      </Head>
      <main className={styles.container}>
        <form onSubmit={handleAddTask}>
          <input
            type='text'
            placeholder='Digite sua tarefa...'
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type='submit'>
            <FiPlus size={25} color='#17181f' />
          </button>
        </form>

        <h1>
          Você tem {taskList.length}{' '}
          {taskList.length === 1 ? 'tarefa' : 'tarefas'}!
        </h1>

        <section>
          {taskList.map((task) => (
            <article key={task.id} className={styles.taskList}>
              <Link href={`/board/${task.id}`}>
                <a>{task.task}</a>
              </Link>
              <div className={styles.actions}>
                <div>
                  <div>
                    <FiCalendar size={20} color='#ffb800' />
                    <time>{task.createdFormatted}</time>
                  </div>
                  <button>
                    <FiEdit size={20} color='#fff' />
                    <span>Editar</span>
                  </button>
                </div>

                <button>
                  <FiTrash size={20} color='#ff3636' />
                  <span>Excluir</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      <div className={styles.vipContainer}>
        <h3>Obrigado por apoiar esse projeto.</h3>
        <div>
          <FiClock size={28} color='#fff' />
          <time>Última doação foi a 3 dias.</time>
        </div>
      </div>

      <SupportButton />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const db = getFirestore(firebaseApp);

  const tasksRef = collection(db, 'tasks');

  const q = query(tasksRef, where('userId', '==', session.id));
  const querySnapshot = await getDocs(q);

  const data = JSON.stringify(
    querySnapshot.docs.map((doc) => ({
      id: doc.id,
      createdFormatted: format(doc.data().created.toDate(), 'dd MMMM yyyy'),
      ...doc.data(),
    }))
  );

  console.log(data);

  const user = {
    name: session?.user.name,
    id: session?.id,
  };

  return {
    props: { user, data },
  };
};
