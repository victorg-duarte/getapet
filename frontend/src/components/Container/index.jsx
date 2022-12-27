import React from 'react'

import styles from './index.module.css';

function Container({children}) {
  return (
    <main className={styles.container}>
      {children}
    </main>
  )
}

export default Container