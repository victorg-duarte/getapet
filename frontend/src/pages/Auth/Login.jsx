import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';

import { useForm } from "@mantine/form";
import { TextInput, Button, PasswordInput } from '@mantine/core';

import formStyles from "../../components/Form/Form.module.css";

// context
import { Context } from '../../context/UserContext';

function Login() {
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useContext(Context)

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Informe o email'),
      password: (value) => (value.length > 0 ? null : 'Informe o senha'),
    },
  })

  // function handleChange(e) {
  //   // pelo spread operator pega obj atual e substitui os dados do obj pelos dados enviados 'event'
  //   setUser({ ...user, [e.target.name]: e.target.value })
  // }

  function handleSubmit(values) {
    // setUser({ ...user, [e.target.name]: e.target.value })
    // e.preventDefault()
    setIsLoading(true)
    login(values, setIsLoading)
  }

  return (
    <section className={formStyles.form_container}>
      <h1>Login</h1>
      {/* <form onSubmit={handleSubmit}>
        <Input
          text="E-mail"
          type="email"
          name="email"
          placeholder="Digite o seu e-mail"
          handleOnChange={handleChange}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite a sua senha"
          handleOnChange={handleChange}
        />
        <Button color="yellow" fullWidth type='submit' loading={isLoading} loaderPosition="right">
          Entrar
        </Button>
      </form> */}
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextInput mt="md" label="Email" {...form.getInputProps('email')} />
        <PasswordInput
          {...form.getInputProps('password')}
          label="Senha"
          mt="md"
        />
        <Button mt="md" color="green" fullWidth type='submit' loading={isLoading} loaderPosition="right">
          Entrar
        </Button>
      </form>
      <p>
        Não tem conta? <Link to="/register">Clique Aqui!</Link>
      </p>
    </section>
  )
}

export default Login