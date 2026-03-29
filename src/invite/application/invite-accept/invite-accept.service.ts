import type { AcceptInviteDto } from "../../domain/dto/accept-invite.dto";
import type { CreateUserServiceInterface } from "../../../user/domain/services/create-user-service.interface";
import { InviteAcceptServiceInterface } from "../../domain/services/invite-accept-service.interface";
import { InviteRepositoryInterface } from "../../domain//repositories/invite-repository.interface";
import { UserCollectionInterface } from "@user/domain/collection/user.collection.interface";

export class InviteAcceptService implements InviteAcceptServiceInterface {
  private createUserService: CreateUserServiceInterface;
  private inviteRepository: InviteRepositoryInterface;

  constructor(
    createUserService: CreateUserServiceInterface,
    inviteRepository: InviteRepositoryInterface
  ) {
    this.createUserService = createUserService;
    this.inviteRepository = inviteRepository;
  }

  async run(payload: AcceptInviteDto): Promise<UserCollectionInterface> {
    const { invite, ...user } = payload;

    try {
      // Crear nuevo usuario usando el repositorio
      const findInvite = await this.inviteRepository.findOne(invite);
      if (!findInvite) {
        const error = new Error("Invalid or expired token");
        (error as any).status = 400; // Bad Request
        (error as any).property = "TOKEN";
        throw error;
      }

      const inviteCompanyId = findInvite.company_id?.toString?.();
      const userCreated = await this.createUserService.run({
        ...user,
        ...(inviteCompanyId ? { company_id: inviteCompanyId } : {}),
      });

       await this.inviteRepository.updatePartial(findInvite, {
        status: "accepted",
      });

      return userCreated;
    } catch (err) {
      console.error("[InviteUserService]", err);
      const error = new Error("Error creating user");
      (error as any).status = 500; // Internal Server Error
      (error as any).property = "USER";
      throw error;
    }
  }
}
