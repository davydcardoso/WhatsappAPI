import { Users } from "../domain/users";

export interface UsersRepository {
  exists(email: string): Promise<boolean>;
  create(user: Users): Promise<void>
}