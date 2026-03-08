import type { CreateInviteDto } from "../../domain/dto/create-invite.dto";
import type { CreateUserServiceInterface } from "../../../user/domain/services/create-user-service.interface";
import { findInviteUserServiceInterface } from "../../domain/services/find-invite.interface";
import { InviteRepositoryInterface } from "../../domain//repositories/invite-repository.interface";
import { InviteCollectionInterface } from "../../domain/collection/invite.collection.interface";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export class FindInviteService implements findInviteUserServiceInterface {
  private inviteRepository: InviteRepositoryInterface;

  constructor(inviteRepository: InviteRepositoryInterface) {
    this.inviteRepository = inviteRepository;
  }

  async run(_id: string): Promise<InviteCollectionInterface> {
    try {
      // Crear nuevo usuario usando el repositorio
      const invite = await this.inviteRepository.findOne(_id);
      if (!invite) {
        const error = new Error("Invite not found");
        (error as any).status = 404; // Not Found
        (error as any).property = "INVITE_NOT_FOUND";
        throw error;
      }
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
