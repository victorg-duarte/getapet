import { useEffect, useState } from 'react'
import styles from './index.module.css'
import bus from '../../utils/bus'
import { Alert } from '@mantine/core';
import { BsCheck2, BsExclamationCircle } from "react-icons/bs";

function Message() {
  const [visibility, setVisibility] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('')

  useEffect(() => {
    bus.addListener('flash', ({ message, type }) => {
      setVisibility(true)
      setMessage(message)
      setType(type)

      setTimeout(() => {
        setVisibility(false)
      }, 5000)
    })

  }, [])

  return (
    <div className={styles.message}>
      {visibility && <Alert
        icon={type === 'success' ? <BsCheck2 size={16} /> : <BsExclamationCircle size={16} />}
        title={type === 'success' ? 'Sucesso' : 'Erro'}
        color={type === 'success' ? 'green' : 'red'}
        variant="filled">
        {message}
      </Alert>}
    </div>
  )
}

export default Message