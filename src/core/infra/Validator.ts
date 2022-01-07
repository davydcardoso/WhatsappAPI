import { Either } from '../logic/Either';

export interface Validator<T = any> {
  validate(data: T): Either<Error, null>
}
