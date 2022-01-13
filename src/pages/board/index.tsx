import Head from 'next/head';
import styles from './styles.module.scss';
import { FiPlus, FiCalendar, FiEdit, FiTrash, FiClock } from 'react-icons/fi';
import { SupportButton } from '../../components/SupportButton';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import firebaseApp from '../../services/firebaseConnection';
import { addDoc, collection } from 'firebase/firestore/lite';
import { getFirestore } from 'firebase/firestore/lite';

interface BoardProps {
  user: {
    id: string;
    name: string;
  };
}

export default function Board({ user }: BoardProps) {
  const [input, setInput] = useState('');

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
      name: user.name
    })
      .then((document) => {
        console.log('CADASTRADO COM SUCESSO!');
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
            onChange={(event) => setInput(event.target.value)}
          />
          <button type='submit'>
            <FiPlus size={25} color='#17181f' />
          </button>
        </form>

        <h1>Você tem 2 tarefas!</h1>

        <section>
          <article className={styles.taskList}>
            <p>Aprender</p>
            <div className={styles.actions}>
              <div>
                <div>
                  <FiCalendar size={20} color='#ffb800' />
                  <time>17 Julho 2021</time>
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
        permanent: false
      }
    };
  }

  const user = {
    name: session?.user.name,
    id: session?.id
  };

  return {
    props: { user }
  };
};
