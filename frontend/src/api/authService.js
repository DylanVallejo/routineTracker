import axiosClient from './axiosClient'

export function registrarUsuario({ nombre, correo, password }) {
  return axiosClient.post('/auth/register', { nombre, correo, password }).then((res) => res.data)
}

export function iniciarSesion({ correo, password }) {
  return axiosClient.post('/auth/login', { correo, password }).then((res) => res.data)
}

export function verificarCuenta(token) {
  return axiosClient.post('/auth/verificar', { token }).then((res) => res.data)
}

export function reenviarVerificacion(correo) {
  return axiosClient.post('/auth/reenviar-verificacion', { correo }).then((res) => res.data)
}

export function recuperarPassword(correo) {
  return axiosClient.post('/auth/recuperar', { correo }).then((res) => res.data)
}

export function restablecerPassword({ token, password }) {
  return axiosClient.post('/auth/restablecer', { token, password }).then((res) => res.data)
}
