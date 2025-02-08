import { Injectable, signal } from '@angular/core';
import { LocalStorageConstants } from '@constants/local-storage.constants';
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  public permissions: string[] = [];
  public currentTitle: string = '';
  paramSource = signal<string>('');

  setSource = (data: string) => this.paramSource.set(data)

  constructor() {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.permissions = JSON.parse(localStorage.getItem(LocalStorageConstants.PERMISSIONS) ?? '[]');
  }

  setCurrentProgramCode(programCode: string): void {
    this.setSource(programCode);
  }

  setCurrentTitleForm(title: string): void {
    this.currentTitle = title;
  }
}
