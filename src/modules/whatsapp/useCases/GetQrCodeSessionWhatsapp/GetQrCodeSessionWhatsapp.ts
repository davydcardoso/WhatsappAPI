import fs from "fs";
import { Either, left, right } from "@core/logic/Either";
import { QrCodeImageNotFoundError } from "./errors/QrCodeImageNotFoundError";
import { Redis } from "ioredis";
import { publicFolder } from "@config/upload";

type GetQrCodeSessionWhatsappRequest = {
  companyId: string;
};

type GetQrCodeSessionWhatsappResponse = Either<Error, ResponseData>;

type ResponseData = {
  qrcode: string;
};

export class GetQrCodeSessionWhatsapp {
  constructor(private redis: Redis) {}

  async perform({
    companyId
  }: GetQrCodeSessionWhatsappRequest): Promise<GetQrCodeSessionWhatsappResponse> {
    const fileName = `${publicFolder}/qrcode/${companyId}.png`;

    const qrcode = await this.redis.get(`@hiperion.qrcode-${companyId}`);

    if (!qrcode || qrcode === null) {
      return left(new QrCodeImageNotFoundError());
    }

    // const qrcode = await new Promise<string>((resolve, reject) => {
    //   fs.readFile(fileName, "base64", (err, data) => {
    //     if (err) {
    //       reject(new QrCodeImageNotFoundError());
    //     }

    //     resolve(data);
    //   });
    // });

    return right({ qrcode });
  }
}
