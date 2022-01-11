import fs from "fs";
import { Either, right } from "@core/logic/Either";

type GetQrCodeSessionWhatsappRequest = {
  userId: string;
};

type GetQrCodeSessionWhatsappResponse = Either<Error, ResponseData>;

type ResponseData = {
  qrcode: string;
};

export class GetQrCodeSessionWhatsapp {
  async perform({
    userId,
  }: GetQrCodeSessionWhatsappRequest): Promise<GetQrCodeSessionWhatsappResponse> {
    const fileName = `./public/qrcode/${userId}.png`;

    const qrcode = await new Promise<string>((resolve, reject) => {
      fs.readFile(fileName, "base64", (err, data) => {
        if (err) {
          reject(err);
        }
        
        resolve(data);
      });
    });

    return right({ qrcode });
  }
}
