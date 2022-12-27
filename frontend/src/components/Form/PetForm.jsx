
import { useState } from "react";
import formStyles from "./Form.module.css";
import Input from "./Input";
import Select from "./Select";

function PetForm({ handleSubmit, petData, btnText }) {
  const [pet, setPet] = useState(petData || {})
  const [preview, setPreview] = useState([])
  const colors = ['Branco', 'Preto', 'Cinza', 'Caramelo', 'Mesclado']

  function handleChange(e) {
    setPet({ ...pet, [e.target.name]: e.target.value })
  }

  function onFileChange(e) {
    setPreview(Array.from(e.target.files)) // transforma FileList em Array
    setPet({ ...pet, images: e.target.files })
  }

  function handleColor(e) {
    setPet({ ...pet, color: e.target.options[e.target.selectedIndex].text })
  }

  function submit(e) {
    e.preventDefault()
    handleSubmit(pet)
  }


  return (
    <form className={formStyles.form_container} onSubmit={submit}>
      <div className={formStyles.preview_pet_images}>
        {preview.length > 0
          ? preview.map((image, index) => (
            <img
              style={{ objectFit: 'cover', height: '150px', width: '150px' }}
              src={URL.createObjectURL(image)}
              alt={pet.name}
              key={`${pet.name}+${index}`}
            />
          ))
          : pet.images &&
          pet.images.map((image, index) => (
            <img
              style={{ objectFit: 'cover', borderRadius: '100%', height: '300px', width: '300px' }}
              src={`${import.meta.env.VITE_API}/images/pets/${image}`}
              alt={pet.name}
              key={`${pet.name}+${index}`}
            />
          ))}
      </div>
      <Input
        text="Imagem do Pet"
        type="file"
        name="image"
        handleOnChange={onFileChange}
        multiple="true"
      />
      <Input
        text="Nome do Pet"
        type="text"
        name="name"
        placeholder="Digite o nome"
        handleOnChange={handleChange}
        value={pet.name || ''}
      />
      <Input
        text="Idade do Pet"
        type="text"
        name="age"
        placeholder="Digite a idade"
        handleOnChange={handleChange}
        value={pet.age || ''}
      />
      <Input
        text="Peso do Pet"
        type="number"
        name="weight"
        placeholder="Digite o peso"
        handleOnChange={handleChange}
        value={pet.weight || ''}
      />
      <Select
        name="color"
        text="Selecione uma cor"
        options={colors}
        handleOnChange={handleColor}
        value={pet.color || ''}
      />
      <input type="submit" value={btnText} />
    </form>
  )
}

export default PetForm