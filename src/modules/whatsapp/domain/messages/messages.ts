import { Entity } from "@core/domain/Entity";
import { Either, right } from "@core/logic/Either";

type MessagesProps = {
  companyId: string;
  ack: number;
  read: boolean;
  fromMe: boolean;
  body: string;
  isMedia: boolean;
  isDeleted: boolean;
};

export class Messages extends Entity<MessagesProps> {
  get companyId() {
    return this.props.companyId;
  }

  get ack() {
    return this.props.ack;
  }

  get read() {
    return this.props.read;
  }

  get fromMe() {
    return this.props.fromMe;
  }

  get body() {
    return this.props.body;
  }

  get isMedia() {
    return this.props.isMedia;
  }

  get isDeleted() {
    return this.props.isDeleted;
  }

  private constructor(props: MessagesProps, id?: string) {
    super(props, id);
  }

  static create(props: MessagesProps, id?: string): Either<Error, Messages> {
    const messages = new Messages(props, id);

    return right(messages);
  }
}
