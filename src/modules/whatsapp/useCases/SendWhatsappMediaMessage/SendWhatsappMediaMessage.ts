import { Either, left, right } from "@core/logic/Either";
import { UsersRepository } from "@modules/accounts/repositories/UsersRepository";
import { AccountIsNotActivedError } from "@modules/accounts/useCases/AuthenticationUser/errors/AccountIsNotActivedError";
import { CompanysRepository } from "@modules/companys/repositories/CompanysRepository";
import SocketClient from "socket.io-client";

type SendWhatsappMediaMessageRequest = {
  companyId: string;
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
  constructor(private companysRepository: CompanysRepository) {}

  async perform({
    companyId,
    to,
    contents
  }: SendWhatsappMediaMessageRequest): Promise<SendWhatsappMediaMessageResponse> {
    const { actived } = await this.companysRepository.findById(companyId);

    if (!actived) {
      return left(new AccountIsNotActivedError());
    }

    const io = SocketClient(
      `${process.env.BACKEND_URL}:${process.env.PORT_WEBSOCKET}`
    );

    io.connect();

    io.emit("whatsapp.send-message-media", {
      token: companyId,
      message: {
        to,
        contents
      }
    } as SendMessageMediaWebsocketData);

    return right({});
  }
}
