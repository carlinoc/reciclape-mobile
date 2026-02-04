import client from './client';

export const createNeighbor = async (data: {
  phoneNumber: string;
  name: string;
  lastName?: string;
  email: string;
  password: string;
  dni?: string;
  municipalityId: string;
}) => {
  const response = await client.post('/neighbors', data);
  return response.data;
};

export const getNeighbor = async (id: string) => {
  const response = await client.get(`/neighbors/${id}`);
  return response.data;
};

export const updateNeighbor = async (id: string, data: any) => {
  const response = await client.patch(`/neighbors/${id}`, data);
  return response.data;
};

export const getPointsHistory = async (neighborId: string) => {
  const response = await client.get(`/neighbors/${neighborId}/points-history`);
  return response.data;
};