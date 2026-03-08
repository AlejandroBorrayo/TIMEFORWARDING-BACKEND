export const VERIFY_SUBSCRIPTION_SERVICE = Symbol(
  'VerifySubscriptionServiceInterface',
);

export interface VerifySubscriptionServiceInterface {
  run(payload: any, variables: any, context: any): Promise<boolean>;
}
