import axiosClient from './axiosClient'

export function listarSesiones() {
  return axiosClient.get('/sesiones').then((res) => res.data)
}

export function obtenerSesion(id) {
  return axiosClient.get(`/sesiones/${id}`).then((res) => res.data)
}

export function crearSesion(datos) {
  return axiosClient.post('/sesiones', datos).then((res) => res.data)
}

export function actualizarSesion(id, datos) {
  return axiosClient.put(`/sesiones/${id}`, datos).then((res) => res.data)
}

export function eliminarSesion(id) {
  return axiosClient.delete(`/sesiones/${id}`)
}
