import React from 'react'
import styles from './index.module.css'

function RoundedImage({ src, alt, width }) {
  return (
    <img
      className={`${styles.rounded_image} ${styles[width]}`}
      src={src}
      alt={alt}
    />
  )
}

export default RoundedImage