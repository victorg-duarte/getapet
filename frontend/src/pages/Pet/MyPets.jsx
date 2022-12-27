import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useFlashMessage from '../../hooks/useFlashMessage'
import api from '../../utils/api'

import RoundedImage from '../../components/RoundedImage'

import styles from './Pets.module.css'


// function MyPets() {
//   const [pets, setPets] = useState([])
//   const [token] = useState(localStorage.getItem('token') || '')
//   const { setFlashMessage } = useFlashMessage()

//   const options = {
//     method: 'GET',
//     headers: {
//       'Authorizarion': `Bearer ${JSON.parse(token)}`,
//     },
//   }

//   useEffect(() => {
//     api.get('/pets/mypets', {
//       headers: {
//         Authorizarion: `Bearer ${JSON.parse(token)}`
//       }
//     }).then((response) => {
//       console.log(response);
//       setPets(response.data.pets)
//     }).catch((error) => {
//       console.log(error.response.data.message);
//     })

//   }, [token])

//   function removePet(id) {
//     let msgType = 'success'

//     api.delete(`/pets/${id}`, {
//       headers: {
//         Authorizarion: `Bearer ${JSON.parse(token)}`
//       }
//     }).then((response) => {
//       const updatedPets = pets.filter((pet) => pet._id !== id)
//       setPets(updatedPets)
//       setFlashMessage(response.data.message, msgType)
//     }).catch((error) => {
//       msgType = 'error'
//       setFlashMessage(error.response.data.message, msgType)
//     })
//   }

//   function concludeAdoption(id) {
//     let msgType = 'success'

//     api.patch(`/pets/conclude/${id}`, {
//       headers: {
//         Authorizarion: `Bearer ${JSON.parse(token)}`
//       }
//     }).then((response) => {
//       setFlashMessage(response.data.message, msgType)
//     }).catch((error) => {
//       msgType = 'success'
//       setFlashMessage(error.response.data.message, msgType)
//     })
//   }

//   return (
//     <section>
//       <div className={styles.petslist_header}>
//         <h1>Meus Pets</h1>
//         <Link to="/pet/add">Cadastrar Pet</Link>
//       </div>
//       <div className={styles.petslist_container}>
//         {pets.length > 0 && (
//           pets.map((pet) => (
//             <div key={pet._id} className={styles.petlist_row}>
//               <RoundedImage
//                 src={`${import.meta.env.VITE_API}/images/pets/${pet.images[0]}`}
//                 alt={pet.name}
//                 width='px75'
//               />
//               <span className='bold'>{pet.name}</span>
//               <div className={styles.actions}>
//                 {pet.available ? (
//                   <>
//                     {pet.adopter && (
//                       <button onClick={() => concludeAdoption(pet._id)} className={styles.conclude_btn}>Concluir Adoção</button>
//                     )}
//                     <Link to={`/pet/edit/${pet._id}`}>Editar</Link>
//                     <button onClick={() => removePet(pet._id)}>Excluir</button>
//                   </>
//                 ) : (
//                   <>
//                     Adotado! &#128151;
//                   </>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//         {pets.length === 0 && (
//           <p>Não há pets cadastrados!</p>
//         )}
//       </div>
//     </section>
//   )
// }

function MyPets() {
  const [pets, setPets] = useState([])
  const [token] = useState(localStorage.getItem('token') || '')
  const { setFlashMessage } = useFlashMessage()

  useEffect(() => {
    api
      .get('/pets/mypets', {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setPets(response.data.pets)
      })
  }, [token])

  async function removePet(id) {
    let msgType = 'success'

    const data = await api
      .delete(`/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        const updatedPets = pets.filter((pet) => pet._id != id)
        setPets(updatedPets)
        return response.data
      })
      .catch((err) => {
        console.log(err)
        msgType = 'error'
        return err.response.data
      })

    setFlashMessage(data.message, msgType)
  }

  async function concludeAdoption(id) {
    let msgType = 'success'

    const data = await api
      .patch(`/pets/conclude/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        return response.data
      })
      .catch((err) => {
        console.log(err)
        msgType = 'error'
        return err.response.data
      })

    setFlashMessage(data.message, msgType)
  }

  return (
    <section>
      <div className={styles.petslist_header}>
        <h1>Meus Pets Cadastrados</h1>
        <Link to="/pet/add">Cadastrar Pet</Link>
      </div>
      <div className={styles.petslist_container}>
        {pets.length > 0 &&
          pets.map((pet) => (
            <div key={pet._id} className={styles.petlist_row}>
              <RoundedImage
                src={`${import.meta.env.VITE_API}/images/pets/${pet.images[0]}`}
                alt={pet.name}
                width="px75"
              />
              <span className="bold">{pet.name}</span>
              <div className={styles.actions}>
                {pet.available ? (
                  <>
                    {pet.adopter && (
                      <button
                        className={styles.conclude_btn}
                        onClick={() => {
                          concludeAdoption(pet._id)
                        }}
                      >
                        Concluir adoção
                      </button>
                    )}

                    <Link to={`/pet/edit/${pet._id}`}>Editar</Link>
                    <button
                      onClick={() => {
                        removePet(pet._id)
                      }}
                    >
                      Excluir
                    </button>
                  </>
                ) : (
                  <p>Pet já adotado</p>
                )}
              </div>
            </div>
          ))}
        {pets.length === 0 && <p>Ainda não há pets cadastrados!</p>}
      </div>
    </section>
  )
}

export default MyPets