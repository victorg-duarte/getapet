import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useFlashMessage from "../../hooks/useFlashMessage"

import PetForm from "../../components/Form/PetForm"

import api from "../../utils/api"

import styles from './AddPet.module.css'

function EditPet() {
  const [pet, setPet] = useState({})
  const { id } = useParams()
  const [token] = useState(localStorage.getItem('token') || '')
  const { setFlashMessage } = useFlashMessage()
  const navigate = useNavigate()

  function updatePet(pet) {
    let msgText = 'success'
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
    api.patch(`/pets/${pet._id}`, formData, {
      headers: {
        Authorizarion: `Bearer ${JSON.parse(token)}`,
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      navigate('/pet/mypets')
      setFlashMessage(response.data.message, msgText)
    }).catch((error) => {
      console.log(error)
      msgText = 'error'
      setFlashMessage(error.response.data.message, msgText)
    })
  }

  useEffect(() => {
    api.get(`/pets/${id}`, {
      headers: {
        Authorizarion: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      setPet(response.data.pet)
    }).catch((error) => {
      console.log(error)
    })
  }, [token, id])

  return (
    <section>
      <div className={styles.addpet_header}>
        <h1>Editando o Pet: {pet.name}</h1>
        <p>Depois da edição os dados serão atualizados no sistema</p>
        {pet.name && (
          <PetForm handleSubmit={updatePet} petData={pet} btnText='Atualizar' />
        )}
      </div>
    </section>
  )
}

export default EditPet