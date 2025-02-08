export interface AuthResponse {
  id: string;
  username: string;
  email: string;
  permissions: string[];
  token: string;
  refreshToken: string;
}
