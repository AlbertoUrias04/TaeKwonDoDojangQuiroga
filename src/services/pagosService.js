import api from './api';

export const obtenerPagos = async (filtros = {}) => {
  const params = new URLSearchParams();

  if (filtros.alumnoId) params.append('alumnoId', filtros.alumnoId);
  if (filtros.conceptoId) params.append('conceptoId', filtros.conceptoId);
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
  if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);

  const response = await api.get(`/pagos?${params.toString()}`);
  return response.data;
};

export const obtenerPago = async (id) => {
  const response = await api.get(`/pagos/${id}`);
  return response.data;
};

export const registrarPago = async (pago) => {
  const response = await api.post('/pagos', pago);
  return response.data;
};

export const modificarPago = async (id, pago) => {
  const response = await api.put(`/pagos/${id}`, pago);
  return response.data;
};

export const eliminarPago = async (id) => {
  const response = await api.delete(`/pagos/${id}`);
  return response.data;
};

export const obtenerEstadisticasPagos = async (filtros = {}) => {
  const params = new URLSearchParams();

  if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
  if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);

  const response = await api.get(`/pagos/estadisticas?${params.toString()}`);
  return response.data;
};
