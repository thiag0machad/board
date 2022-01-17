import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.scss';

export function SignInButton() {
  const { data: session } = useSession();

  return session ? (
    <button
      type='button'
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      <div>
        <Image
          src={session.user.image}
          alt='Foto do usuário'
          width={35}
          height={35}
        />
      </div>
      Olá {session.user.name}
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
