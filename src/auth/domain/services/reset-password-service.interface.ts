export const RESET_PASSWORD_SERVICE = Symbol('ResetPasswordServiceInterface');

export interface ResetPasswordServiceInterface {
  run(newPaswword: string, token: string): Promise<{ success: boolean }>;
}
