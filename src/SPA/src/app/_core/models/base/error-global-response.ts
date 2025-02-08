export interface ErrorGlobalResponse {
  trackId?: string; // Will be null or undefined when writing
  type?: string;    // Will be null or undefined when writing
  message: string; // Will be null or undefined when writing
  statusCode: number;
  detail?: string;  // Will be null or undefined when writing
  instance?: string;// Will be null or undefined when writing
  errors?: string[];// Will be null or undefined when writing
}
