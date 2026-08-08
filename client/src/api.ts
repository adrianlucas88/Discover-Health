import type {
  AuthResponse,
  HealthcareResource,
  NewHealthcareResource,
  User
} from './types';

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    if (data.details && Array.isArray(data.details)) {
      throw new Error(`${data.error} ${data.details.join(' ')}`);
    }

    throw new Error(data.error || 'Request failed');
  }

  return data as T;
}

export async function getResourcesByRegion(
  region: string
): Promise<HealthcareResource[]> {
  const response = await fetch(
    `/api/resources?region=${encodeURIComponent(region)}`
  );

  return handleResponse<HealthcareResource[]>(response);
}

export async function addResource(
  resource: NewHealthcareResource
): Promise<HealthcareResource> {
  const response = await fetch('/api/resources', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(resource)
  });

  return handleResponse<HealthcareResource>(response);
}

export async function recommendResource(
  id: number
): Promise<HealthcareResource> {
  const response = await fetch(`/api/resources/${id}/recommend`, {
    method: 'POST'
  });

  return handleResponse<HealthcareResource>(response);
}

export async function signup(
  username: string,
  password:"***"
): Promise<AuthResponse> {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      username: username,
      password: "***"
    })
  });

  return handleResponse<AuthResponse>(response);
}

export async function login(
  username: string,
  password: "***"
): Promise<AuthResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      username: username,
      password: "***"
    })
  });

  return handleResponse<AuthResponse>(response);
}

export async function logout(): Promise<{ message: string }> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });

  return handleResponse<{ message: string }>(response);
}

export async function getCurrentUser(): Promise<{ user: User }> {
  const response = await fetch('/api/auth/me', {
    credentials: 'include'
  });

  return handleResponse<{ user: User }>(response);
}