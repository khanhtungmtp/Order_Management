// using for menu bar left
export interface FunctionVM {
  id: string;
  name: string;
  url: string;
  sortOrder: number;
  parentId: string;
  icon: string;
  commandInFunction: string[];
  children?: FunctionVM[];
  newLinkFlag: boolean;
  open?: boolean;
  selected?: boolean; // Check or not
  menuType: 'C' | 'F'; // c: menu, f button
}

export interface ITreeNode {
  id: string;
  parentId: string | null;
  children: ITreeNode[];
}

export interface FunctionTreeVM {
  id: string;
  name: string;
  url: string;
  sortOrder: number;
  parentId: string | null;
  icon: string;
  newLinkFlag: boolean;
  open?: boolean;
  selected?: boolean; // Check or not
  menuType: 'C' | 'F'; // c: menu, f button
  children: FunctionTreeVM[];
}
