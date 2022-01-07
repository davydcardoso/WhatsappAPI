import { Client } from "whatsapp-web.js";

import qrcode from "qrcode-terminal";

const client = new Client({});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", (session) => {
  console.log(session);
});

client.initialize();
