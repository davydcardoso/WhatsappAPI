import { DomainError } from "@core/domain/errors/DomainError";

export class InvalidDocumentUserError extends Error implements DomainError {
  constructor(document: string) {
    super(`The document "${document}" is invalid`);
    this.name = "InvalidDocumentUserError";
  }
}
