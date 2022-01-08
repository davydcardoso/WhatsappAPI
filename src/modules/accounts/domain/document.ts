import { Either, left, right } from "@core/logic/Either";
import { InvalidDocumentUserError } from "./errors/InvalidDocumentUserError";

export class Document {
  private readonly document: string;

  get value() {
    return this.document;
  }

  private constructor(document: string) {
    this.document = document;
  }

  static validate(document: string): boolean {
    if (!document) {
      return true;
    }

    if (document.trim().length < 5 || document.trim().length > 255) {
      return false;
    }

    const regex =
      /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)|(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/;

    if (!regex.test(document)) {
      return false;
    }

    return true;
  }

  static create(document: string): Either<InvalidDocumentUserError, Document> {
    if (!this.validate(document)) {
      return left(new InvalidDocumentUserError(document));
    }

    return right(new Document(document));
  }
}
