export interface RecoveryPasswordServiceInterface {
  run(email: string,apiKey:string): Promise<{ success: boolean }>;
}
