import client from './client';

export interface Department {
  id: string;
  name: string;
}

export interface Province {
  id: string;
  name: string;
  departmentId: string;
}

export interface District {
  id: string;
  name: string;
  provinceId: string;
  isActive: boolean;
}

export const getDepartments = async (): Promise<Department[]> => {
  const response = await client.get('/departments');
  return response.data.departments || response.data;
};

export const getProvinces = async (departmentId: string): Promise<Province[]> => {
  const response = await client.get(`/provinces?departmentId=${departmentId}`);
  return response.data.provinces || response.data;
};

export const getDistricts = async (provinceId: string): Promise<District[]> => {
  const response = await client.get(`/districts?provinceId=${provinceId}`);
  return response.data.districts || response.data;
};

export const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
  try {
    const token = process.env.MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}&language=es`
    );
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      return data.features[0].place_name;
    }
    
    return 'Dirección no encontrada';
  } catch (error) {
    console.error('Error en reverse geocoding:', error);
    return 'Error al obtener dirección';
  }
};

const locationService = {
  getDepartments,
  getProvinces,
  getDistricts,
  reverseGeocode,
};

export default locationService;