export interface UserSearchRequest {
  userName: string | null;
  email: string | null;
  phoneNumber: string | null;
  fullName: string | null;
  gender: number; // 0 nam, 1 nữ
  isActive: boolean | null;
  dateOfBirth: string | null;
}
