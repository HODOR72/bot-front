import jwtDecode from 'jwt-decode';
// routes
import { PATH_AUTH } from '../routes/paths';
//
import ApiClients from './axios';
import { ITokens } from 'src/@types/auth';

// ----------------------------------------------------------------------

const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode<{ exp: number }>(accessToken);
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

export const handleTokenExpired = (exp: number) => {
  let expiredTimer;

  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(() => {
    alert('Token expired');

    localStorage.removeItem('tokens');

    window.location.href = PATH_AUTH.login;
  }, timeLeft);
};

const setSession = (tokens: ITokens | null) => {
  if (tokens) {
    localStorage.setItem('tokens', JSON.stringify(tokens));
    Object.values(ApiClients).forEach(
      (instance) => (instance.defaults.headers.common.Authorization = `Bearer ${tokens.access_token}`)
    );
  } else {
    localStorage.removeItem('tokens');
    Object.values(ApiClients).forEach(
      (instance) => delete instance.defaults.headers.common.Authorization
    );
  }
};

export { isValidToken, setSession };
