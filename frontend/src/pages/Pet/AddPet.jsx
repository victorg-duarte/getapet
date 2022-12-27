import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import PetForm from '../../components/Form/PetForm'

import useFlashMessage from '../../hooks/useFlashMessage'
import api from '../../utils/api'

import styles from './AddPet.module.css'
function AddPet() {
  const [token] = useState(localStorage.getItem('token') || '')
  const { setFlashMessage } = useFlashMessage()
  const navigate = useNavigate()

  async function registerPet(pet) {
    let msgType = 'success'

    const formData = new FormData()

    Object.keys(pet).forEach((key) => {
      if (key === 'images') {
        for (let i = 0; i < pet[key].length; i++) {
          formData.append('images', pet[key][i])
        }
      } else {
        formData.append(key, pet[key])
      }
    })

    console.log('oq temno formData', formData);

    api.post('/pets/create', formData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      navigate('/pet/mypets')
      setFlashMessage(response.data.message, msgType)
    }).catch((error) => {
      msgType = 'error'
      setFlashMessage(error.response.data.message, msgType)
    })
  }

  return (
    <section className={styles.addpet_header}>
      <div>
        <h1>Cadastre um Pet</h1>
        <p>Depois ele ficará disponível para adoção</p>
        <PetForm handleSubmit={registerPet} btnText="Cadastrar Pet" />
      </div>
    </section>
  )
}

export default AddPet