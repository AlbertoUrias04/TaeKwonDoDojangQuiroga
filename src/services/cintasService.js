import api from './api';

export const obtenerCintas = async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.activo !== undefined) params.append('activo', filtros.activo);

    const queryString = params.toString();
    const response = await api.get(`/cintas${queryString ? '?' + queryString : ''}`);
    return response.data;
};

export const obtenerCintaPorId = async (id) => {
    const response = await api.get(`/cintas/${id}`);
    return response.data;
};
