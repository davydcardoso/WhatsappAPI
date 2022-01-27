import { UseCaseError } from "@core/domain/errors/UseCaseError";

export class InvalidSessionWhatsappError extends Error implements UseCaseError {
  constructor() {
    super("The session whatsapp is invalid");
    this.name = "InvalidSessionWhatsappError";
  }
}
