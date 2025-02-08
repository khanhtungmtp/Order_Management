import { ITreeNode } from "./functionvm";

export interface PermissionScreenVm {
  id: string;
  name: string;
  parentId: string | null;
  url: string;
  sortOrder: number;
  icon: string;
  hasCreate: boolean;
  hasUpdate: boolean;
  hasDelete: boolean;
  hasView: boolean;
  hasApprove: boolean;
  children: PermissionScreenVm[];
}
