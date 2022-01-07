export interface Services<T = any> {
  handle: (request: T) => Promise<void>;
}
