import api from './api';

export const obtenerPagos = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();

    if (filtros.alumnoId) params.append('alumnoId', filtros.alumnoId);
    if (filtros.conceptoId) params.append('conceptoId', filtros.conceptoId);
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);

    const response = await api.get(`/pagos?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    throw error;
  }
};

export const obtenerPago = async (id) => {
  try {
    const response = await api.get(`/pagos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener pago:', error);
    throw error;
  }
};

export const registrarPago = async (pago) => {
  try {
    const response = await api.post('/pagos', pago);
    return response.data;
  } catch (error) {
    console.error('Error al registrar pago:', error);
    throw error;
  }
};

export const modificarPago = async (id, pago) => {
  try {
    const response = await api.put(`/pagos/${id}`, pago);
    return response.data;
  } catch (error) {
    console.error('Error al modificar pago:', error);
    throw error;
  }
};

export const eliminarPago = async (id) => {
  try {
    const response = await api.delete(`/pagos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar pago:', error);
    throw error;
  }
};

export const obtenerEstadisticasPagos = async (filtros = {}) => {
  try {
    const params = new URLSearchParams();

    if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
    if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);

    const response = await api.get(`/pagos/estadisticas?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de pagos:', error);
    throw error;
  }
};
