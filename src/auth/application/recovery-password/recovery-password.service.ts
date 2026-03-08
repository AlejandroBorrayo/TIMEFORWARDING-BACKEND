// src/auth/application/change-password.service.ts

import * as bcrypt from "bcrypt";
import type { UserRepositoryInterface } from "../../../user/domain/repository/user-repository.interface";
import { InviteRepositoryInterface } from "../../../invite/domain/repositories/invite-repository.interface";
import type { RecoveryPasswordServiceInterface } from "../../domain/services/recovery-password-service.interface";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import type { JwtServiceInterface } from "@auth/domain/services/jwt-service.interface";
import { FindApikeyByServiceInterface } from "@apikey/domain/services/find-apikey-by-service.interface";

export interface LoginServiceConfig {
  expiresIn: number;
}

export class RecoveryPasswordService
  implements RecoveryPasswordServiceInterface
{
  private readonly expiresIn: number;
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly inviteRepository: InviteRepositoryInterface,
    private readonly jwtService: JwtServiceInterface,
    private readonly findApikeyByApikeyService: FindApikeyByServiceInterface,
    config: LoginServiceConfig
  ) {
    this.expiresIn = config.expiresIn;
  }

  async run(email: string, apikey: string): Promise<{ success: boolean }> {
    const exist = await this.userRepository.exists(email);
    if (!exist) {
      return { success: true };
    }
    const userApikey = await this.findApikeyByApikeyService.run(apikey);
    if (!userApikey) {
      const err: any = new Error("User not allowed");
      err.status = 403;
      throw err;
    }
    const token = this.jwtService.sign(
      {
        email,
      },
      this.expiresIn,
      userApikey.secret
    );

    // Buscamos al usuario actual
    const invite = await this.inviteRepository.create({
      email,
      token,
      status: "pending",
      type: "recovery_password",
    });

    if (!invite) {
      const error: any = new Error("Resource not found");
      error.status = 404;
      error.property = "INVITE";
      throw error;
    }

    const mailerSend = new MailerSend({
      apiKey:
        "mlsn.7c29264e4bf8175dac33f1c67765ddfb9a63363316c13df1403b8247afa8a189",
    });

    const sentFrom = new Sender("ventas@timetrekcourriers.com", "Timetrek");

    const recipients = [new Recipient(email)];

    const personalization = [
      {
        email,
        data: {
          url: "https://timetrekcouriers.com/auth/cambiar-contrasena?token=" + token,
        },
      },
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Timetrek - Recuperación de contraseña")
      .setTemplateId("o65qngkkn1ogwr12")
      .setPersonalization(personalization);

    await mailerSend.email.send(emailParams);

    return { success: true };
  }
}
