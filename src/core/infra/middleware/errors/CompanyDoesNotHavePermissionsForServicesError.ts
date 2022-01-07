import { UseCaseError } from "../../../domain/errors/UseCaseError";

export class CompanyDoesNotHavePermissionsForServicesError
  extends Error
  implements UseCaseError
{
  constructor() {
    super("Company does not have permissions for services this role");
    this.name = "CompanyDoesNotHavePermissionsForServicesError";
  }
}
