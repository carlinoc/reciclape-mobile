import client from './client';

export const getRecyclingTypes = async (municipalityId: string) => {
  const response = await client.get(`/recycling-types?municipalityId=${municipalityId}`);
  return response.data;
};