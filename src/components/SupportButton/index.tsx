import Link from 'next/link';
import styles from './styles.module.scss';
import React from 'react';

export function SupportButton() {
  return (
    <div className={styles.donateContainer}>
      <Link href='/donate'>
        <button>Apoiar</button>
      </Link>
    </div>
  );
}
