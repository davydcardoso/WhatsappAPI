import { UseCaseError } from "@core/domain/errors/UseCaseError";

export class QrCodeImageNotFoundError extends Error implements UseCaseError {
  constructor() {
    super("Qr code for your session has not yet been generated");
  }
}
