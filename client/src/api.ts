import type { ApiError, HealthcareResource, NewHealthcareResource } from './types';

const parseResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();

  if (!response.ok) {
    const apiError = data as ApiError;
    const message = apiError.details?.length
      ? `${apiError.error} ${apiError.details.join(' ')}`
      : apiError.error;

    throw new Error(message);
  }

  return data as T;
};

export const getResourcesByRegion = async (
  region: string
): Promise<HealthcareResource[]> => {
  const response = await fetch(`/api/resources?region=${encodeURIComponent(region)}`);
  return parseResponse<HealthcareResource[]>(response);
};

export const addResource = async (
  resource: NewHealthcareResource
): Promise<HealthcareResource> => {
  const response = await fetch('/api/resources', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(resource)
  });

  return parseResponse<HealthcareResource>(response);
};

export const recommendResource = async (
  id: number
): Promise<HealthcareResource> => {
  const response = await fetch(`/api/resources/${id}/recommend`, {
    method: 'POST'
  });

  return parseResponse<HealthcareResource>(response);
};