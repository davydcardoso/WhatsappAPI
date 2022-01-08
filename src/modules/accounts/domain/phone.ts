import { Either, left, right } from "@core/logic/Either";
import { InvalidPhoneNumberError } from "./errors/InvalidPhoneNumberError";

export class Phone {
  private readonly phone: string;

  get value() {
    return this.phone;
  }

  private constructor(phone: string) {
    this.phone = phone;
  }

  static validate(phone: string): boolean {
    if (!phone || phone.trim().length < 10 || phone.trim().length > 28) {
      return false;
    }

    const regex =
      /^(?:\+)[0-9]{2}\s?(?:\()[0-9]{2}(?:\))\s?[0-9]{4,5}(?:-)[0-9]{4}$/;

    if (!regex.test(phone)) {
      return false;
    }

    return true;
  }

  static create(phone: string): Either<InvalidPhoneNumberError, Phone> {
    if (!this.validate(phone)) {
      return left(new InvalidPhoneNumberError(phone));
    }

    return right(new Phone(phone));
  }
}
