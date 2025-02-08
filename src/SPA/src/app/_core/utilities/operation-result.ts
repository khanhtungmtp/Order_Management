export interface OperationResult<T = any> {
  statusCode: number;
  succeeded: boolean;
  message: string;
  data?: T; // Optional data property of type T
}

export interface HttpCustomConfig {
  needSuccessInfo?: boolean; // Do you need the "operation successful" prompt?
  typeAction?: 'add' | 'edit' | 'delete' | 'download' | 'view'; // display the corresponding message based on the type
  otherUrl?: boolean; // Is it a third-party interface?
  sendCookie?: boolean;
}
