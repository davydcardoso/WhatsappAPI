import { UseCaseError } from "@core/domain/errors/UseCaseError";

export class InvalidMethodAuthenticationError
  extends Error
  implements UseCaseError
{
  constructor() {
    super("The expected authentication method was Basic");
    this.name = "InvalidMethodAuthenticationError";
  }
}
