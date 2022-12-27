import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import useFlashMessage from "../../hooks/useFlashMessage"
import api from "../../utils/api"

import styles from './PetDetails.module.css'

import { Carousel } from '@mantine/carousel';
import { Container } from "@mantine/core"

function PetDetails() {
  const [pet, setPet] = useState([])
  const { id } = useParams()
  const { setFlashMessage } = useFlashMessage()
  const [token] = useState(localStorage.getItem('token') || '')

  function schedule() {
    let msgType = 'success'

    api.patch(`/pets/schedule/${id}`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then((response) => {
      setFlashMessage(response.data.message, msgType)
    }).catch((error) => {
      msgType = 'error'
      setFlashMessage(error.response.data.message, msgType)
    })
  }

  useEffect(() => {
    api.get(`/pets/${id}`).then((response) => {
      setPet(response.data.pet)
    })
  }, [id])

  return (
    <>
      {pet.name && (
        <section className={styles.pet_details_container}>
          <div className={styles.pet_details_header}>
            <h1>Conhecendo o Pet: {pet.name}</h1>
            <h3>Se tiver interesse, marque uma visita com para conhece-lô</h3>
          </div>
          <div>
            <Container size="xs" px="sm">
              <Carousel
                slideSize="10%"
                slideGap="xl"
                dragFree
                styles={{
                  control: {
                    '&[data-inactive]': {
                      opacity: 0,
                      cursor: 'default',
                    },
                  },
                }}
              >
                {pet?.images && pet.images.map((image, index) => (
                  <Carousel.Slide key={index} style={{
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <img
                      style={{ width: '526px', maxHeight: '426px' }}
                      src={`${import.meta.env.VITE_API}/images/pets/${image}`}
                      alt={pet.name}
                    />
                  </Carousel.Slide>
                ))}
              </Carousel>
            </Container>
            <div>
              <p>
                <span className="bold">Peso:</span> {pet.weight}
              </p>
              <p>
                <span className="bold">Idade:</span> {pet.age}
              </p>
              {token ? (
                <button onClick={schedule} className={styles.btn_action}>
                  Solicitar uma visita
                </button>
              ) : (
                <Link to='/login'>
                  <p>Para solicitar a visita é preciso está logado</p>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default PetDetails 