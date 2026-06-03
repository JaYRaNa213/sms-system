export class ProviderException extends Error {
  constructor(
    public readonly provider: string,
    message: string,
    public readonly rawError?: any,
  ) {
    super(`[${provider}] ${message}`);
    this.name = 'ProviderException';
  }
}
