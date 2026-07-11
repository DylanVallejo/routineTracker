import axiosClient from './axiosClient'

export function obtenerProgreso(ejercicioId, { inicio, fin } = {}) {
  return axiosClient
    .get(`/progreso/${ejercicioId}`, { params: { inicio, fin } })
    .then((res) => res.data)
}
