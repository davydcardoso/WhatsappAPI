import { Companys } from "../domain/companys";

export interface CompanysRepository {
  exists(email: string): Promise<boolean>;
  create(companys: Companys): Promise<void>
}