import { useState, useEffect } from 'react'
import Input from '../../../components/Form/Input';
import formStyles from "../../../components/Form/Form.module.css";
import styles from "./index.module.css";

import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { TextInput, Button, PasswordInput } from '@mantine/core';

import api from '../../../utils/api';
import useFlashMessage from '../../../hooks/useFlashMessage';
import RoundedImage from '../../../components/RoundedImage';

function Profile() {
  const [user, setUser] = useState({})
  const [preview, setPreview] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [visible, { toggle }] = useDisclosure(false);
  const [token] = useState(localStorage.getItem('token') || '')
  const { setFlashMessage } = useFlashMessage()

  const profileImgDefault = 'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-Free-Image.png'

  const form = useForm({
    initialValues: {
      name: user.name,
      phone: user.phone,
      email: user.email,
      password: '',
      confirmPassword: ''
    },
    validate: {
      name: (value) => (value.length > 0 ? null : 'Informe o nome'),
      phone: (value) => (value.length > 0 ? null : 'Informe o telefone'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Informe o email'),
      password: (value) => (value.length > 0 ? null : 'Informe o senha'),
      confirmPassword: (value, values) => {
        if (!value) return 'Informe a confirmação de senha'
        if (value !== values.password) return 'As senhas não correspondem'
      },
    },
  })



  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value })
  }
  function onFileChange(e) {
    setPreview(e.target.files[0])
    setUser({ ...user, [e.target.name]: e.target.files[0] })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    let msgType = 'success'
    let msgText = 'Atualizado com sucesso!'

    const formData = new FormData()

    Object.keys(user).forEach((key) => {
      formData.append(key, user[key])
    })

    api.patch(`/users/edit/${user._id}`, formData, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      setFlashMessage(response.data.message, msgType)
      setIsLoading(false)
    }).catch((error) => {
      msgType = 'error'
      msgText = error.response.data.message
      setFlashMessage(msgText, msgType)
      setIsLoading(false)
    })


  }

  useEffect(() => {

    api.get('/users/checkuser', {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`
      }
    }).then(async (response) => {
      setUser(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }, [token])
  return (
    <section className={formStyles.form_container}>
      <div className={styles.profile_header}>
        <h1>Perfil</h1>
        <div
          className={styles.container_image}
          style={{
            backgroundImage: `url(${preview ?
              URL.createObjectURL(preview) :
              (user?.image ? `${import.meta.env.VITE_API}/images/users/${user.image}` : profileImgDefault)})`
          }}
        >
          <label htmlFor="uploadImage" className={styles.btn_upload_image}>
            <span>Upload foto</span>
          </label>
        </div>
        <p><strong>Clique acima para escolher a foto</strong></p>
      </div>
      {/* <form onSubmit={form.onSubmit((values) => handleSubmit(values))}> */}
      <form onSubmit={handleSubmit}>
        <input style={{ display: 'none' }} type="file" name="image" id="uploadImage" onChange={onFileChange} />
        <Input
          text="E-mail"
          type="email"
          name="email"
          placeholder="Digite o seu e-mail"
          handleOnChange={handleChange}
          value={user.email || ''}
        />
        <Input
          text="Nome"
          type="text"
          name="name"
          placeholder="Digite o seu nome"
          handleOnChange={handleChange}
          value={user.name || ''}
        />
        <Input
          text="Telefone"
          type="text"
          name="phone"
          placeholder="Digite o seu telefone"
          handleOnChange={handleChange}
          value={user.phone || ''}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite a sua senha"
          handleOnChange={handleChange}
        />
        <Input
          text="Confirmação de senha"
          type="password"
          name="confirmPassword"
          placeholder="Confirme a sua senha"
          handleOnChange={handleChange}
        />
        <input type="submit" value="Salvar" />
        {/* <TextInput mt="md" defaultValue={user.name} label="Nome" {...form.getInputProps('name')} />
        <TextInput mt="md" defaultValue={user.phone} label="Telefone" {...form.getInputProps('phone')} />
        <TextInput mt="md" defaultValue={user.email} label="Email" {...form.getInputProps('email')} />
        <PasswordInput
          mt="md"
          label="Senha"
          visible={visible}
          onVisibilityChange={toggle}
          {...form.getInputProps('password')}
        />
        <PasswordInput
          mt="md"
          label="Confirmação de senha"
          visible={visible}
          onVisibilityChange={toggle}
          {...form.getInputProps('confirmPassword')}
        />

        <input style={{ display: 'none' }} type="file" name="image" id="uploadImage" onChange={onFileChange} />

        <Button mt="md" color="green" fullWidth type='submit' loading={isLoading} loaderPosition="right">
          Atualizar
        </Button> */}
      </form>
    </section>
  )
}

export default Profile