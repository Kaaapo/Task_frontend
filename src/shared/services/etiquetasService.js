import axiosInstance from '../config/axiosConfig';

export const etiquetasService = {
  getAll: async () => {
    const { data } = await axiosInstance.get('/etiquetas');
    return data;
  },
  getByEmpresa: async (empresaId) => {
    const { data } = await axiosInstance.get(`/etiquetas/empresa/${empresaId}`);
    return data;
  },
  getById: async (id) => {
    const { data } = await axiosInstance.get(`/etiquetas/${id}`);
    return data;
  },
  create: async (etiqueta) => {
    const { data } = await axiosInstance.post('/etiquetas', etiqueta);
    return data;
  },
  update: async (id, etiqueta) => {
    const { data } = await axiosInstance.put(`/etiquetas/${id}`, etiqueta);
    return data;
  },
  delete: async (id) => {
    await axiosInstance.delete(`/etiquetas/${id}`);
  },
};
