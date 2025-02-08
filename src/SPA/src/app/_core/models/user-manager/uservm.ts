export interface UserVM {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  dateOfBirth: Date | string;
  gender: number; // 0 cho Male (nam), 1 cho Female (nu)
  isActive: boolean;
  roles: string[];
  lastLoginTime: Date | string | null;
}

