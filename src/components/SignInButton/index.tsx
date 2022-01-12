import styles from './styles.module.scss';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/react';

export function SignInButton() {
  const { data: session } = useSession();

  console.log(session);

  return session ? (
    <button
      type='button'
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      <img
        src='https://sujeitoprogramador.com/steve.png'
        alt='Foto do usuário'
      />
      Olá Thiago
      <FiX color='#737380' className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type='button'
      className={styles.signInButton}
      onClick={() => signIn('github')}
    >
      <FaGithub color='#ffb800' />
      Entrar com GitHub
    </button>
  );
}
