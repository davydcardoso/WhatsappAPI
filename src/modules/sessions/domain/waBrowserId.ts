import { Either, left, right } from "@core/logic/Either";
import { InvalidWaBrowserIdError } from "./errors/InvalidWaBrowserIdError";

export class WABrowserId {
  private readonly waBrowserId: string;

  get value() {
    return this.waBrowserId;
  }

  private constructor(waBrowserId: string) {
    this.waBrowserId = waBrowserId;
  }

  static validate(waBrowserId: string): boolean {
    if (!waBrowserId || waBrowserId.trim().length < 5) {
      return false;
    }

    return true;
  }

  static create(
    waBrowserId: string
  ): Either<InvalidWaBrowserIdError, WABrowserId> {
    if (!this.validate(waBrowserId)) {
      return left(new InvalidWaBrowserIdError());
    }

    return right(new WABrowserId(waBrowserId));
  }
}
