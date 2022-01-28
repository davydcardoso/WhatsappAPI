import { Sessions } from "../domain/sessions";

export interface SessionsRepository {
  findByCompanyId(accountId: string): Promise<Sessions>;
  create(session: Sessions): Promise<void>;
  updateStatus(accountId: string, status: string): Promise<void>;
  findMany(): Promise<Sessions[]>;
}
