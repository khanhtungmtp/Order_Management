const port: string = `:${+window.location.port - 1}`;
const protocol: string = window.location.protocol;
const hostname: string = window.location.hostname;
const ip: string = `${hostname}${port}`;
const apiUrl: string = `${protocol}//${ip}`;

export const environment = {
  production: true,
  baseUrl: `${apiUrl}/`,
  apiUrl: `${apiUrl}/api/`,
  apiImageUrl: `${apiUrl}/images/languages/`,
  allowedDomains: [ip],
  disallowedRoutes: [`${apiUrl}/api/auth`],
};
