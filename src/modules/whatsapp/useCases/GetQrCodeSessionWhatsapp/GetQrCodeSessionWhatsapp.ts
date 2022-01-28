import fs from "fs";
import { Either, right } from "@core/logic/Either";
import { QrCodeImageNotFoundError } from "./errors/QrCodeImageNotFoundError";

type GetQrCodeSessionWhatsappRequest = {
  companyId: string;
};

type GetQrCodeSessionWhatsappResponse = Either<Error, ResponseData>;

type ResponseData = {
  qrcode: string;
};

export class GetQrCodeSessionWhatsapp {
  async perform({
    companyId
  }: GetQrCodeSessionWhatsappRequest): Promise<GetQrCodeSessionWhatsappResponse> {
    const fileName = `./public/qrcode/${companyId}.png`;

    const qrcode = await new Promise<string>((resolve, reject) => {
      fs.readFile(fileName, "base64", (err, data) => {
        if (err) {
          reject(new QrCodeImageNotFoundError());
        }

        resolve(data);
      });
    });

    return right({ qrcode });
  }
}
