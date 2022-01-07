export interface QueuesHandler<T = any> {
  perform(data?: T): Promise<void>;
}
