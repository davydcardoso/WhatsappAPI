import { Either, left, right } from "@core/logic/Either";
import { InvalidStatusSessionError } from "./errors/InvalidStatusSessionError";

export class Status {
  private readonly status: string;

  private readonly statusType = [
    "hiperion.ativo",
    "hiperion.disabled",
    "hiperion.qrcode",
  ];

  get value() {
    return this.status;
  }

  private constructor(status: string) {
    this.status = status;
  }

  static validate(status: string): boolean {
    if (!status || status.trim().length < 5 || status.trim().length > 255) {
      return false;
    }

    return true;
  }

  static create(status: string): Either<InvalidStatusSessionError, Status> {
    if (!this.validate(status)) {
      return left(new InvalidStatusSessionError());
    }

    return right(new Status(status));
  }
}
