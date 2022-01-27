import { Either, left, right } from "@core/logic/Either";
import { InvalidFantasyNameValueError } from "./errors/InvalidFantasyNameValueError";

export class FantasyName {
  private readonly fantasyName: string;

  get value() {
    return this.fantasyName;
  }

  private constructor(fantasyName: string) {
    this.fantasyName = fantasyName;
  }

  static validate(fantasyName: string): boolean {
    if (
      !fantasyName ||
      fantasyName.trim().length < 5 ||
      fantasyName.trim().length > 255
    ) {
      return false;
    }

    return true;
  }

  static create(
    fantasyName: string
  ): Either<InvalidFantasyNameValueError, FantasyName> {
    if (!this.validate(fantasyName)) {
      return left(new InvalidFantasyNameValueError(fantasyName));
    }

    return right(new FantasyName(fantasyName));
  }
}
