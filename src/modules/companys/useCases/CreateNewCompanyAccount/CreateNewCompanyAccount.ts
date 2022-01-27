import { Either, left, right } from "@core/logic/Either";
import { BullProvider } from "@infra/providers/implementations/queue/BullProvider";
import { UsersRepository } from "@modules/accounts/repositories/UsersRepository";
import { CreateNewAccounts } from "@modules/accounts/useCases/CreateNewAccounts/CreateNewAccounts";
import { Companys } from "@modules/companys/domain/companys";
import { Document } from "@modules/companys/domain/document";
import { Email } from "@modules/companys/domain/email";
import { InvalidDocumentValueError } from "@modules/companys/domain/errors/InvalidDocumentValueError";
import { InvalidEmailCompanyError } from "@modules/companys/domain/errors/InvalidEmailCompanyError";
import { InvalidFantasyNameValueError } from "@modules/companys/domain/errors/InvalidFantasyNameValueError";
import { InvalidNameValueError } from "@modules/companys/domain/errors/InvalidNameValueError";
import { InvalidPhoneNumberError } from "@modules/companys/domain/errors/InvalidPhoneNumberError";
import { InvalidWebhookAccountError } from "@modules/companys/domain/errors/InvalidWebhookAccountError";
import { FantasyName } from "@modules/companys/domain/fantasyName";
import { Name } from "@modules/companys/domain/name";
import { Phone } from "@modules/companys/domain/phone";
import { Webhook } from "@modules/companys/domain/webhook";
import { CompanysRepository } from "@modules/companys/repositories/CompanysRepository";
import { v4 } from "uuid";
import { CompanysAccountAlreadyExistsError } from "./errors/CompanysAccountAlreadyExistsError";
import { UserCannotBeRegisteredError } from "./errors/UserCannotBeRegisteredError";

type CreateNewCompanyAccountRequest = {
  name: string;
  fantasyName: string;
  document: string;
  email: string;
  phone: string;
  webhook: string;
};

type CreateNewCompanyAccountResponse = Either<Error, null>;

export class CreateNewCompanyAccount {
  constructor(
    private companysRepository: CompanysRepository,
    private bullProvider: BullProvider,
    private createNewAccounts: CreateNewAccounts
  ) {}

  async perform({
    name,
    fantasyName,
    document,
    email,
    phone,
    webhook
  }: CreateNewCompanyAccountRequest): Promise<CreateNewCompanyAccountResponse> {
    const companyId = v4();

    const password =
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).toUpperCase().slice(2);

    const nameOrError = Name.create(name);
    const fantasyNameOrError = FantasyName.create(fantasyName);
    const documentOrError = Document.create(document);
    const emailOrError = Email.create(email);
    const phoneOrError = Phone.create(phone);
    const webhookOrError = Webhook.create(webhook);

    if (nameOrError.isLeft()) {
      return left(new InvalidNameValueError(name));
    }

    if (fantasyNameOrError.isLeft()) {
      return left(new InvalidFantasyNameValueError(fantasyName));
    }

    if (documentOrError.isLeft()) {
      return left(new InvalidDocumentValueError(document));
    }

    if (emailOrError.isLeft()) {
      return left(new InvalidEmailCompanyError(email));
    }

    if (phoneOrError.isLeft()) {
      return left(new InvalidPhoneNumberError(phone));
    }

    if (webhookOrError.isLeft()) {
      return left(new InvalidWebhookAccountError(webhook));
    }

    const companysOrError = Companys.create({
      id: companyId,
      name: nameOrError.value,
      fantasyName: fantasyNameOrError.value,
      document: documentOrError.value,
      email: emailOrError.value,
      phone: phoneOrError.value,
      webhook: webhookOrError.value
    });

    if (companysOrError.isLeft()) {
      return left(companysOrError.value);
    }

    const companys = companysOrError.value;

    const companyAlreadyExists = await this.companysRepository.exists(
      companys.email.value
    );

    if (companyAlreadyExists) {
      return left(new CompanysAccountAlreadyExistsError());
    }

    const userCreated = await this.createNewAccounts.perform({
      email: companys.email.value,
      name: companys.name.value,
      password: password.toString(),
      companyId: companys.id,
      accessLevel: "ADM"
    });

    if (userCreated.isLeft()) {
      return left(userCreated.value);
    }

    await this.companysRepository.create(companys);

    await this.bullProvider.addJob({
      message: {
        id: v4(),
        subject: "Seja bem vindo a Rocketzapi",
        body: `Olá ${companys.name.value}, seja bem vindo a Rocketzapi \n
        Segue os dados de sua conta..: \n
        E-mail: ${companys.email.value}
        Senha: ${password.toString()}
        Whatsapp: ${companys.phone.value}
        Documento (CPF/CNPJ): ${companys.document.value}
        Webhook: ${companys.webhook.value}

        Seu cadastro está sendo analisado, assim que nossa equipe finalizar o processo
        você receberá um email e uma mensagem no whatsapp avisando a finalização do processo.. \n
        Agradecemos a confiança em nossos serviços...`
      },
      recipient: {
        id: v4(),
        email: companys.email.value,
        name: companys.email.value
      },
      sender: {
        name: process.env.MAIL_NAME,
        email: process.env.MAIL_USER
      }
    });

    return right(null);
  }
}
