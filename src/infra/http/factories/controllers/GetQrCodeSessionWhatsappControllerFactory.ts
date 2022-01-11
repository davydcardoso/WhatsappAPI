import { Controller } from "@core/infra/Controller";
import { GetQrCodeSessionWhatsapp } from "@modules/whatsapp/useCases/GetQrCodeSessionWhatsapp/GetQrCodeSessionWhatsapp";
import { GetQrCodeSessionWhatsappController } from "@modules/whatsapp/useCases/GetQrCodeSessionWhatsapp/GetQrCodeSessionWhatsappController";

export function makeGetQrCodeSessionWhatsappController(): Controller {
  const getQrCodeSessionWhatsapp = new GetQrCodeSessionWhatsapp();

  const getQrCodeSessionWhatsappController =
    new GetQrCodeSessionWhatsappController(getQrCodeSessionWhatsapp);

  return getQrCodeSessionWhatsappController;
}
