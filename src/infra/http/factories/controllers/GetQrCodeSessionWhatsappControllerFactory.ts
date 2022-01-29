import { Controller } from "@core/infra/Controller";
import { redisConnection } from "@infra/redis/connection";
import { GetQrCodeSessionWhatsapp } from "@modules/whatsapp/useCases/GetQrCodeSessionWhatsapp/GetQrCodeSessionWhatsapp";
import { GetQrCodeSessionWhatsappController } from "@modules/whatsapp/useCases/GetQrCodeSessionWhatsapp/GetQrCodeSessionWhatsappController";

export function makeGetQrCodeSessionWhatsappController(): Controller {
  const RedisConnection = redisConnection;

  const getQrCodeSessionWhatsapp = new GetQrCodeSessionWhatsapp(
    RedisConnection
  );

  const getQrCodeSessionWhatsappController =
    new GetQrCodeSessionWhatsappController(getQrCodeSessionWhatsapp);

  return getQrCodeSessionWhatsappController;
}
