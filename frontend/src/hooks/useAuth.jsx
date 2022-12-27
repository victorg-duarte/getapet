// api
import api from "../utils/api";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFlashMessage from "./useFlashMessage";

export default function useAuth() {
  const [authenticated, setAuthenticated] = useState(false)
  const { setFlashMessage } = useFlashMessage()
  const navigate = useNavigate() // acao de mudar a pagina do usuario

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
      setAuthenticated(true)
    }
  }, [])

  async function authUser(data) {
    setAuthenticated(true)
    localStorage.setItem('token', JSON.stringify(data.token))
    navigate('/')
  }

  function register(user, setIsLoading) {
    let msgText = ''
    let msgType = ''

    api.post('/users/register', user).then(async (response) => {
      msgText = 'Cadastro realizado com sucesso!'
      msgType = 'success'
      setFlashMessage(msgText, msgType)
      await authUser(response.data)
    }).catch((error) => {
      msgText = error.response.data.message
      msgType = 'error'
      setFlashMessage(msgText, msgType)
      setIsLoading(false)
    })
  }

  function login(user, setIsLoading){
    let msgText = ''
    let msgType = ''

    api.post('/users/login', user).then(async (response) => {
      msgText = 'Login realizado com sucesso!'
      msgType = 'success'
      setFlashMessage(msgText, msgType)
      await authUser(response.data)
    }).catch((error) => {
      msgText = error.response.data.message
      msgType = 'error'
      setFlashMessage(msgText, msgType)
      setIsLoading(false)
    })
  }

  function logout() {
    const msgText = 'Logout realizado com sucesso!'
    const msgType = 'success'

    setAuthenticated(false)
    localStorage.removeItem('token')
    api.defaults.headers.Authorization = undefined
    navigate('/')
    setFlashMessage(msgText, msgType)
  }

  return { authenticated, register, logout, login }
}