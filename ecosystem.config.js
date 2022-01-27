module.exports = {
  apps: [
    {
      name: "Hiperion.Service-http",
      script: "node ./dist/infra/http/server.js",
    },
    {
      name: "Hiperion.Queue-Mail",
      script: "node dist/infra/queue/worker.js",
    },
    {
      name: "Hiperion.Service-Whatsapp",
      script: "node dist/infra/whatsapp/client.js",
    },
  ],
};
