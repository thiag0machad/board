import Head from 'next/head';
import {
  FiPlus,
  FiCalendar,
  FiEdit,
  FiTrash,
  FiClock,
  FiX,
} from 'react-icons/fi';
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
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore/lite';
import { format } from 'date-fns';
import Link from 'next/link';
import styles from './styles.module.scss';
import firebaseApp from '../../services/firebaseConnection';
import { SupportButton } from '../../components/SupportButton';

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

  const [taskEdit, setTaskEdit] = useState<TaskList | null>(null);

  const db = getFirestore(firebaseApp);

  async function handleAddTask(event: FormEvent) {
    event.preventDefault();

    if (input === '') {
      alert('Preencha alguma tarefa!');
      return;
    }

    if (taskEdit) {
      await updateDoc(doc(db, 'tasks', taskEdit.id), {
        task: input,
      })
        .then(() => {
          const data = taskList;
          const taskIndex = taskList.findIndex(
            (item) => item.id === taskEdit.id
          );
          data[taskIndex].task = input;

          setTaskList(data);
          setTaskEdit(null);
          setInput('');
        })
        .catch((error) => {
          console.log(error);
        });

      return;
    }

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

  async function handleDelete(taskId: string) {
    await deleteDoc(doc(db, 'tasks', taskId))
      .then(() => {
        console.log('DELETADO COM SUCESSO!');

        const newTaskList = taskList.filter((item) => {
          return item.id !== taskId;
        });
        setTaskList(newTaskList);
      })
      .catch((error) => {
        console.log('ERRO AO DELETAR: ', error);
      });
  }

  async function handleEditTask(task: TaskList) {
    setTaskEdit(task);
    setInput(task.task);
  }

  async function handleCancelEdit() {
    setTaskEdit(null);
    setInput('');
  }

  return (
    <>
      <Head>
        <title>Minhas Tarefas - Board</title>
      </Head>
      <main className={styles.container}>
        {taskEdit && (
          <span className={styles.warnText}>
            <button onClick={handleCancelEdit}>
              <FiX size={30} color='#ff3636' />
            </button>
            Você está editando uma tarefa!
          </span>
        )}

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
                  <button onClick={() => handleEditTask(task)}>
                    <FiEdit size={20} color='#fff' />
                    <span>Editar</span>
                  </button>
                </div>

                <button onClick={() => handleDelete(task.id)}>
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

  const querySnapshot = await getDocs(
    query(collection(db, 'tasks'), where('userId', '==', session.id))
  );

  const data = JSON.stringify(
    querySnapshot.docs.map((doc) => ({
      id: doc.id,
      createdFormatted: format(doc.data().created.toDate(), 'dd MMMM yyyy'),
      ...doc.data(),
    }))
  );

  const user = {
    name: session?.user.name,
    id: session?.id,
  };

  return {
    props: { user, data },
  };
};
