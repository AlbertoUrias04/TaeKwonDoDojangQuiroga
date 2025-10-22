import api from './api';

export const obtenerAlumnos = async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.nombre) params.append('nombre', filtros.nombre);
    if (filtros.activo !== undefined) params.append('activo', filtros.activo);
    if (filtros.cintaId) params.append('cintaId', filtros.cintaId);
    if (filtros.claseId) params.append('claseId', filtros.claseId);

    const response = await api.get(`/alumnos?${params.toString()}`);
    return response.data;
};

export const obtenerAlumnoPorSlug = async (slug) => {
    const response = await api.get(`/alumnos/${slug}`);
    return response.data;
};

export const crearAlumno = async (alumno) => {
    const response = await api.post('/alumnos', alumno);
    return response.data;
};

export const actualizarAlumno = async (slug, alumno) => {
    const response = await api.put(`/alumnos/${slug}`, alumno);
    return response.data;
};

export const cambiarEstadoAlumno = async (slug, activo) => {
    const response = await api.patch(`/alumnos/${slug}/estado`, { slug, activo });
    return response.data;
};
