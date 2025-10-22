import api from './api';

export const obtenerClases = async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.activo !== undefined) params.append('activo', filtros.activo);
    if (filtros.tipoClase) params.append('tipoClase', filtros.tipoClase);

    const response = await api.get(`/clases?${params.toString()}`);
    return response.data;
};

export const obtenerClasePorSlug = async (slug) => {
    const response = await api.get(`/clases/${slug}`);
    return response.data;
};

export const crearClase = async (clase) => {
    const response = await api.post('/clases', clase);
    return response.data;
};

export const actualizarClase = async (slug, clase) => {
    const response = await api.put(`/clases/${slug}`, clase);
    return response.data;
};

export const eliminarClase = async (slug) => {
    const response = await api.delete(`/clases/${slug}`);
    return response.data;
};
