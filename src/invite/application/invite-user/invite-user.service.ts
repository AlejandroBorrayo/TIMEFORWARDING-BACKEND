import type { CreateInviteDto } from "../../domain/dto/create-invite.dto";
import { InviteUserServiceInterface } from "../../domain/services/invite-user.interface";
import { InviteRepositoryInterface } from "../../domain//repositories/invite-repository.interface";
import { InviteCollectionInterface } from "../../domain/collection/invite.collection.interface";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import type { FindApikeyByServiceInterface } from "../../../apikey/domain/services/find-apikey-by-service.interface";
import { JwtServiceInterface } from "@auth/domain/services/jwt-service.interface";

export interface LoginServiceConfig {
  expiresIn: number;
}

export class InviteUserService implements InviteUserServiceInterface {
  private inviteRepository: InviteRepositoryInterface;
  private findApikeyByApikeyService: FindApikeyByServiceInterface;
  private jwtService: JwtServiceInterface;
  private readonly expiresIn: number;

  constructor(
    inviteRepository: InviteRepositoryInterface,
    findApikeyByApikeyService: FindApikeyByServiceInterface,
    jwtService: JwtServiceInterface,
    config: LoginServiceConfig
  ) {
    this.inviteRepository = inviteRepository;
    this.expiresIn = config.expiresIn;
    this.findApikeyByApikeyService = findApikeyByApikeyService;
    this.jwtService = jwtService;
  }

  async run(
    payload: CreateInviteDto,
    apiKey: string
  ): Promise<InviteCollectionInterface | null> {
    // Verificamos API key
    const userApikey = await this.findApikeyByApikeyService.run(apiKey);
    if (!userApikey) {
      const err: any = new Error("User not allowed");
      err.status = 403;
      throw err;
    }
    const token = this.jwtService.sign(
      {
        name: payload?.name,
        email: payload?.email,
        role: payload?.role,
      },
      this.expiresIn,
      userApikey.secret
    );

    try {
      // Crear nuevo usuario usando el repositorio
      const invite = await this.inviteRepository.create({
        email: payload.email,
        name: payload.name,
        role: payload.role,
        company_id: payload.company_id,
        token,
        status: "pending",
      });

      const mailerSend = new MailerSend({
        apiKey:
          "mlsn.7c29264e4bf8175dac33f1c67765ddfb9a63363316c13df1403b8247afa8a189",
      });

      const sentFrom = new Sender("ventas@timetrekcourriers.com", "Timetrek");

      const recipients = [new Recipient(payload?.email, payload?.name)];

      const personalization = [
        {
          email: payload?.email,
          data: {
            url: `https://timetrekcouriers.com/auth/registro?invite=${token}`,
            name: payload?.name,
          },
        },
      ];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject("TIMETREK - Invitación")
        .setTemplateId("z86org8ow9k4ew13")
        .setPersonalization(personalization);

       await mailerSend.email.send(emailParams);
      return invite;
    } catch (err) {
      console.error("[InviteUserService]", err);
      const error = new Error("Error invite user");
      (error as any).status = 500; // Internal Server Error
      (error as any).property = "INVITE";
      throw error;
    }
  }
}
