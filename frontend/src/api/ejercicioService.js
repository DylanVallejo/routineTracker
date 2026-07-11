import axiosClient from './axiosClient'

export function listarEjercicios({ page = 0, size = 10 } = {}) {
  return axiosClient
    .get('/ejercicios', { params: { page, size } })
    .then((res) => res.data)
}

export function obtenerEjercicio(id) {
  return axiosClient.get(`/ejercicios/${id}`).then((res) => res.data)
}

export function crearEjercicio(datos) {
  return axiosClient.post('/ejercicios', datos).then((res) => res.data)
}

export function actualizarEjercicio(id, datos) {
  return axiosClient.put(`/ejercicios/${id}`, datos).then((res) => res.data)
}

export function eliminarEjercicio(id) {
  return axiosClient.delete(`/ejercicios/${id}`)
}
