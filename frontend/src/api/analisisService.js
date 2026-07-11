import axiosClient from './axiosClient'

export function obtenerAnalisisMuscular({ inicio, fin } = {}) {
  return axiosClient
    .get('/analisis/muscular', { params: { inicio, fin } })
    .then((res) => res.data)
}
