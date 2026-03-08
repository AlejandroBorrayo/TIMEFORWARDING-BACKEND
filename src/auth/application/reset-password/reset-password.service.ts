// src/auth/application/change-password.service.ts

import * as bcrypt from "bcrypt";
import type { UserRepositoryInterface } from "../../../user/domain/repository/user-repository.interface";
import { InviteRepositoryInterface } from "../../../invite/domain/repositories/invite-repository.interface";
import type { ResetPasswordServiceInterface } from "../../domain/services/reset-password-service.interface";
import type { JwtServiceInterface } from "@auth/domain/services/jwt-service.interface";

export class ResetPasswordService implements ResetPasswordServiceInterface {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private inviteRepository: InviteRepositoryInterface,
    private readonly jwtService: JwtServiceInterface
  ) {}

  async run(
    new_password: string,
    token: string
  ): Promise<{ success: boolean }> {
    // Buscamos al usuario actual
    await this.jwtService.decode(token);
    const invite = await this.inviteRepository.findOne(token);

    if (!invite || !new_password || invite?.status === "accepted") {
      const error: any = new Error("Resource not found");
      error.status = 404;
      error.property = "INVITE";
      throw error;
    }

    const user = await this.userRepository.findByLogin(invite.email);
    if (!user) {
      const err: any = new Error("Resource not found");
      err.status = 404;
      throw err;
    }

    try {
      const userUpdated = await this.userRepository.updatePartial(user, {
        password: new_password,
      });

      await this.inviteRepository.updatePartial(invite, {
        status: "accepted",
      });

      return { success: !!userUpdated };
    } catch (error: any) {
      console.error("[ResetPasswordService]", error);
      const err: any = new Error("Update error");
      err.status = 500;
      err.property = "USER";
      throw err;
    }
  }
}
