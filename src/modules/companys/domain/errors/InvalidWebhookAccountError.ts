import { UseCaseError } from "@core/domain/errors/UseCaseError";

export class InvalidWebhookAccountError extends Error implements UseCaseError {
  constructor(webhook: string) {
    super(`The webhook ${webhook} is invalid`);
    this.name = "InvalidWebhookAccountError";
  }
}
