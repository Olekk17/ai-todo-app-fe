import { client } from '../utils/fetchClient';

export const signIn = async(email: string, password: string, onSuccess: () => void) => {
  const token = await client.post<string>(`/signin`, { email, password });

  localStorage.setItem('token', token);
  
  onSuccess();
};

export const signUp = (email: string, password: string) => {
  return client.post<string>(`/signup`, { email, password });
};
