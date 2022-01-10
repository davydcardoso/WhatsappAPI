import { Either, left, right } from "@core/logic/Either";
import { BullProvider } from "@infra/providers/implementations/queue/BullProvider";
import { Document } from "@modules/accounts/domain/document";
import { Email } from "@modules/accounts/domain/email";
import { InvalidDocumentUserError } from "@modules/accounts/domain/errors/InvalidDocumentUserError";
import { InvalidEmailUserError } from "@modules/accounts/domain/errors/InvalidEmailUserError";
import { InvalidNameUserError } from "@modules/accounts/domain/errors/InvalidNameUserError";
import { InvalidPasswordLengthError } from "@modules/accounts/domain/errors/InvalidPasswordLengthError";
import { InvalidPhoneNumberError } from "@modules/accounts/domain/errors/InvalidPhoneNumberError";
import { InvalidWebhookAccountError } from "@modules/accounts/domain/errors/InvalidWebhookAccountError";
import { Name } from "@modules/accounts/domain/name";
import { Password } from "@modules/accounts/domain/password";
import { Phone } from "@modules/accounts/domain/phone";
import { Users } from "@modules/accounts/domain/users";
import { Webhook } from "@modules/accounts/domain/webhook";
import { UsersRepository } from "@modules/accounts/repositories/UsersRepository";
import { v4 } from "uuid";
import { AccountAlreadyExistsError } from "./errors/AccountAlreadyExistsError";

type CreateNewAccountsRequest = {
  name: string;
  email: string;
  password: string;
  phone: string;
  document?: string;
  webhook: string;
};

type CreateNewAccountsResponse = Either<
  | InvalidNameUserError
  | InvalidEmailUserError
  | InvalidPasswordLengthError
  | InvalidPhoneNumberError
  | InvalidDocumentUserError
  | InvalidWebhookAccountError,
  CreateNewAccountsResponseData
>;

type CreateNewAccountsResponseData = {
  message: string;
};

export class CreateNewAccounts {
  constructor(
    private usersRepository: UsersRepository,
    private bullProvider: BullProvider
  ) {}

  async perform({
    name,
    email,
    password,
    phone,
    document,
    webhook,
  }: CreateNewAccountsRequest): Promise<CreateNewAccountsResponse> {
    const nameOrError = Name.create(name);
    const emailOrError = Email.create(email);
    const passwordOrError = Password.create(password);
    const phoneOrError = Phone.create(phone);
    const documentOrError = Document.create(document || "000.000.000-00");
    const webhookOrError = Webhook.create(webhook);

    const tokenWebhook = v4().toUpperCase();

    if (nameOrError.isLeft()) {
      return left(new InvalidNameUserError(name));
    }

    if (emailOrError.isLeft()) {
      return left(new InvalidEmailUserError(email));
    }

    if (passwordOrError.isLeft()) {
      return left(new InvalidPasswordLengthError());
    }

    if (phoneOrError.isLeft()) {
      return left(new InvalidPhoneNumberError(phone));
    }

    if (documentOrError.isLeft()) {
      return left(new InvalidDocumentUserError(document));
    }

    if (webhookOrError.isLeft()) {
      return left(new InvalidWebhookAccountError(webhook));
    }

    const userOrError = Users.create({
      name: nameOrError.value,
      email: emailOrError.value,
      password: passwordOrError.value,
      phone: phoneOrError.value,
      actived: false,
      document: documentOrError.value,
      webhook: webhookOrError.value,
      webhookToken: tokenWebhook,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const user = userOrError.value;

    const userAlreadyExists = await this.usersRepository.exists(
      user.email.value
    );

    if (userAlreadyExists) {
      return left(new AccountAlreadyExistsError(user.email.value));
    }

    await this.usersRepository.create(user);

    await this.bullProvider.addJob({
      message: {
        id: v4(),
        subject: "Seja bem vindo a Rocketzapi",
        body: `Olá ${user.name.value}, seja bem vindo a Rocketzapi \n
        Segue os dados de sua conta..: \n
        E-mail: ${user.email.value}
        Whatsapp: ${user.phone.value}
        Documento (CPF/CNPJ): ${user.document.value}
        Webhook: ${user.webhook.value}
        Webhook Token: ${user.webhookToken}
        
        Seu cadastro está sendo analisado, assim que nossa equipe finalizar o processo 
        você receberá um email e uma mensagem no whatsapp avisando a finalização do processo.. \n
        Agradecemos a confiança em nossos serviços...`,
      },
      recipient: {
        id: v4(),
        email: user.email.value,
        name: user.email.value,
      },
      sender: {
        name: process.env.MAIL_NAME,
        email: process.env.MAIL_USER,
      },
    });

    return right({
      message:
        "Account created successfully, wait that in a moment you will receive an email confirming your data and your access to the platform",
    });
  }
}
