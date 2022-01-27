import { UseCaseError } from "@core/domain/errors/UseCaseError";

export class CompanysAccountAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super("The company accounts already exists");
    this.name = "CompanysAccountAlreadyExistsError";
  }
}
