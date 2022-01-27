import { DomainError } from "@core/domain/errors/DomainError";

export class InvalidDocumentValueError extends Error implements DomainError {
  constructor(document: string) {
    super(`The document "${document}" is invalid`);
    this.name = "InvalidDocumentUserError";
  }
}
