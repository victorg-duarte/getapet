import React from 'react'

import styles from './Input.module.css'

function Input({ type, text, name, placeholder, handleOnChange, value, multiple }) {
  return (
    <div className={styles.form_control}>
      <label htmlFor={{ name }}>{text}:</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleOnChange}
        {...(multiple) ? { multiple } : ''} />
    </div>
  )
}

export default Input