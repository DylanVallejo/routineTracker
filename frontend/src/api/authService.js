import axiosClient from './axiosClient'

export function registrarUsuario({ nombre, correo, password }) {
  return axiosClient.post('/auth/register', { nombre, correo, password }).then((res) => res.data)
}

export function iniciarSesion({ correo, password }) {
  return axiosClient.post('/auth/login', { correo, password }).then((res) => res.data)
}
