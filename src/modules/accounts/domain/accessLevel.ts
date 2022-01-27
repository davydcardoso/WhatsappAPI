import { Either, left, right } from "@core/logic/Either";
import { InvalidAccessLevelValueError } from "./errors/InvalidAccessLevelValueError";

export const accessLevelEnum = [
  "DEVELOPER",
  "ADMINISTRATOR",
  "ATTENDANTS"
] as const;

type AccessLevelProps = typeof accessLevelEnum[number];

export class AccessLevel {
  private readonly accessLevel: AccessLevelProps;

  get value() {
    return this.accessLevel;
  }

  private constructor(accessLevel: AccessLevelProps) {
    this.accessLevel = accessLevel;
  }

  static validate(accessLevel: AccessLevelProps): boolean {
    if (!accessLevel) {
      return false;
    }

    switch (accessLevel) {
      case "ADMINISTRATOR":
        return true;
      case "ATTENDANTS":
        return true;
      case "DEVELOPER":
        return true;
      default:
        return false;
    }
  }

  static create(
    accessLevel: AccessLevelProps
  ): Either<InvalidAccessLevelValueError, AccessLevel> {
    if (!this.validate(accessLevel)) {
      return left(new InvalidAccessLevelValueError(accessLevel.toString()));
    }

    return right(new AccessLevel(accessLevel));
  }
}
