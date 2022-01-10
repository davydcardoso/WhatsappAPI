import { Either, left, right } from "@core/logic/Either";
import { InvalidWebhookAccountError } from "./errors/InvalidWebhookAccountError";

export class Webhook {
  private readonly webhook: string;

  get value() {
    return this.webhook;
  }

  private constructor(webhook: string) {
    this.webhook = webhook;
  }

  static validate(webhook: string): boolean {
    if (!webhook || webhook.trim().length < 5 || webhook.trim().length > 255) {
      return false;
    }

    const regex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/;

    if (!regex.test(webhook)) {
      return false;
    }

    return true;
  }

  static create(webhook: string): Either<InvalidWebhookAccountError, Webhook> {
    if (!this.validate(webhook)) {
      return left(new InvalidWebhookAccountError(webhook));
    }

    return right(new Webhook(webhook));
  }
}
