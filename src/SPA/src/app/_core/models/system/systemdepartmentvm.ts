export interface SystemDepartmentVM {
  id: number;
  department_Name: string;
  sortOrder: number;
  parentId: string;
  isActive: boolean;
  createdBy: string | null;
  updatedBy: string | null;
  createdDate: Date | string;
  updatedDate: Date | string;
}
