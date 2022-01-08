import { Users } from "../domain/users";

export class UsersMappers {
  static async toPersistence(user: Users) {
    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      actived: user.status,
      password: await user.password.getHashedValue(),
      phone: user.phone.value,
      document: user.document.value,
    };
  }
}
