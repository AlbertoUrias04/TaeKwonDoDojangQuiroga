import api from './api';

export const obtenerConceptos = async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.activo !== undefined) params.append('activo', filtros.activo);
    if (filtros.tipoConcepto) params.append('tipoConcepto', filtros.tipoConcepto);

    const response = await api.get(`/conceptos?${params.toString()}`);
    return response.data;
};

export const obtenerConceptoPorSlug = async (slug) => {
    const response = await api.get(`/conceptos/${slug}`);
    return response.data;
};

export const crearConcepto = async (concepto) => {
    const response = await api.post('/conceptos', concepto);
    return response.data;
};

export const actualizarConcepto = async (slug, concepto) => {
    const response = await api.put(`/conceptos/${slug}`, concepto);
    return response.data;
};

export const eliminarConcepto = async (slug) => {
    const response = await api.delete(`/conceptos/${slug}`);
    return response.data;
};
