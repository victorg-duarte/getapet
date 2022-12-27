import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import api from "../utils/api"

import styles from "./Home.module.css";

function Home() {
  const [pets, setPets] = useState([])

  useEffect(() => {
    api.get('/pets').then((response) => {
      setPets(response.data.pets)
    }).catch((error) => {
      console.log(error)
    })
  }, [])

  return (
    <section>
      <div className={styles.pet_home_header}>
        <h1>Adote um Pet</h1>
        <h3>Veja os detalhes de cada um e conheça o tutor deles</h3>
      </div>
      <div className={styles.pet_container}>
        {pets.length > 0 && pets.map(pet => (
          <div key={pet._id} className={styles.pet_card}>
            <img className={styles.pet_card_image} src={`${import.meta.env.VITE_API}/images/pets/${pet.images[0]}`} alt="" />
            <h3>{pet.name}</h3>
            <p>
              <span className="bold">Peso: </span>
              {pet.weight}kg
            </p>
            {pet.available ? (
              <Link to={`pet/${pet._id}`} className={styles.status}>
                <p>Mais detalhes</p>
              </Link>
            ) : (
              <p className={styles.adopted_text}>Adotado! &#128151;</p>
            )}
          </div>
        ))}
        {pets.length === 0 && (
          <p>Não há pets disponíveis para adoção no momento!</p>
        )}
      </div>
    </section>
  )
}

export default Home