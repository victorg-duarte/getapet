import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import Input from '../../components/Form/Input'

import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { TextInput, Button, PasswordInput } from '@mantine/core';

import formStyles from "../../components/Form/Form.module.css";

// context
import { Context } from "../../context/UserContext";

function Register() {
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [visible, { toggle }] = useDisclosure(false);
  const { register } = useContext(Context)

  const form = useForm({
    initialValues: {
      name: '',
      phone: '',
      email: '',
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

  // function handleChange(e) {
  //   setUser({ ...user, [e.target.name]: e.target.value })
  // }

  function handleSubmit(values) {
    // e.preventDefault()
    setIsLoading(true)
    register(values, setIsLoading)
  }

  return (
    <section className={formStyles.form_container}>
      <h1>Registrar</h1>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        {/* <Input
          text="Nome"
          type="text"
          name="name"
          placeholder="Digite o seu nome"
          handleOnChange={handleChange}
        />
        <Input
          text="Telefone"
          type="text"
          name="phone"
          placeholder="Digite o seu telefone"
          handleOnChange={handleChange}
        />
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
        <Input
          text="Confirmação de senha"
          type="password"
          name="confirmPassword"
          placeholder="Confirme a sua senha"
          handleOnChange={handleChange}
        /> */}
        <TextInput mt="md" label="Nome" {...form.getInputProps('name')} />
        <TextInput mt="md" label="Telefone" {...form.getInputProps('phone')} />
        <TextInput mt="md" label="Email" {...form.getInputProps('email')} />
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
        <Button mt="md" color="yellow" fullWidth type='submit' loading={isLoading} loaderPosition="right">
          Cadastrar
        </Button>
      </form>
      <p>
        Já tem conta? <Link to="/login">Clique Aqui!</Link>
      </p>
    </section>
  )
}

export default Register