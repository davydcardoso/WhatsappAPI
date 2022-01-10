import { Either, left, right } from "@core/logic/Either";
import { UsersRepository } from "@modules/accounts/repositories/UsersRepository";
import { AccountIsNotActivedError } from "@modules/accounts/useCases/AuthenticationUser/errors/AccountIsNotActivedError";
import SocketClient from "socket.io-client";

type SendWhatsappMessageRequest = {
  userId: string;
  to: string;
  message: string;
};

type SendMessageWebsocketData = {
  token: string;
  message: {
    to: string;
    message: string;
  };
};

type SendWhatsappMessageResponse = Either<AccountIsNotActivedError, Object>;

export class SendWhatsappMessage {
  constructor(private usersRepository: UsersRepository) {}

  async perform({
    userId,
    to,
    message,
  }: SendWhatsappMessageRequest): Promise<SendWhatsappMessageResponse> {
    const { status } = await this.usersRepository.findById(userId);

    if (!status) {
      return left(new AccountIsNotActivedError());
    }

    const io = SocketClient(
      `${process.env.BACKEND_URL}:${process.env.PORT_WEBSOCKET}`
    );

    io.connect();

    io.emit("whatsapp.send-message", {
      token: userId,
      message: {
        to,
        message,
      },
    } as SendMessageWebsocketData);

    return right({});
  }
}
