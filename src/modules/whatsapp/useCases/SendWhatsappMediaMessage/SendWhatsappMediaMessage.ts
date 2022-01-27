import { Either, left, right } from "@core/logic/Either";
import { UsersRepository } from "@modules/accounts/repositories/UsersRepository";
import { AccountIsNotActivedError } from "@modules/accounts/useCases/AuthenticationUser/errors/AccountIsNotActivedError";
import SocketClient from "socket.io-client";

type SendWhatsappMediaMessageRequest = {
  userId: string;
  to: string;
  contents: {
    media_type: string;
    media: string;
  };
};

type SendMessageMediaWebsocketData = {
  token: string;
  message: {
    to: string;
    contents: {
      media_type: string;
      media: string;
    };
  };
};

type SendWhatsappMediaMessageResponse = Either<
  AccountIsNotActivedError,
  Object
>;

export class SendWhatsappMediaMessage {
  constructor(private usersRepository: UsersRepository) {}

  async perform({
    userId,
    to,
    contents,
  }: SendWhatsappMediaMessageRequest): Promise<SendWhatsappMediaMessageResponse> {
    const { status } = await this.usersRepository.findById(userId);

    if (!status) {
      return left(new AccountIsNotActivedError());
    }

    const io = SocketClient(
      `${process.env.BACKEND_URL}:${process.env.PORT_WEBSOCKET}`
    );

    io.connect();

    io.emit("whatsapp.send-message-media", {
      token: userId,
      message: {
        to,
        contents,
      },
    } as SendMessageMediaWebsocketData);

    return right({});
  }
}
