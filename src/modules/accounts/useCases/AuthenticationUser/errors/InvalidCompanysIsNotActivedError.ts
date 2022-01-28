import { UseCaseError } from "@core/domain/errors/UseCaseError";

export class InvalidCompanysIsNotActivedError
  extends Error
  implements UseCaseError
{
  constructor() {
    super("The company account is not actived");
    this.name = "InvalidCompanysIsNotActivedError";
  }
}
