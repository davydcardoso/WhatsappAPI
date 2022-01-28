import { Either, left, right } from "@core/logic/Either";
import { UsersRepository } from "@modules/accounts/repositories/UsersRepository";
import { AccountIsNotActivedError } from "@modules/accounts/useCases/AuthenticationUser/errors/AccountIsNotActivedError";
import { CompanysRepository } from "@modules/companys/repositories/CompanysRepository";
import SocketClient from "socket.io-client";

type SendWhatsappMessageRequest = {
  companyId: string;
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
  constructor(private companysRepository: CompanysRepository) {}

  async perform({
    companyId,
    to,
    message
  }: SendWhatsappMessageRequest): Promise<SendWhatsappMessageResponse> {
    const { actived } = await this.companysRepository.findById(companyId);

    if (!actived) {
      return left(new AccountIsNotActivedError());
    }

    const io = SocketClient(
      `${process.env.BACKEND_URL}:${process.env.PORT_WEBSOCKET}`
    );

    io.connect();

    io.emit("whatsapp.send-message", {
      token: companyId,
      message: {
        to,
        message
      }
    } as SendMessageWebsocketData);

    return right({});
  }
}
