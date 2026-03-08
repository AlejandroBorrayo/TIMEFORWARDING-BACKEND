import type { UserRepositoryInterface } from "../../domain/repository/user-repository.interface";
import type { CreateUserDto } from "../../domain/dto/create-user.dto";
import type { UserCollectionInterface } from "../../domain/collection/user.collection.interface";
import { CreateUserServiceInterface } from "../../domain/services/create-user-service.interface";

export class CreateUserService implements CreateUserServiceInterface {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async run(payload: CreateUserDto): Promise<UserCollectionInterface> {
    // Verificar si el usuario ya existe
    const exists = await this.userRepository.exists(payload.email);
    if (exists) {
      const error = new Error("User already exists");
      (error as any).status = 409; // Conflict
      (error as any).property = "USER";
      throw error;
    }

    try {
      // Crear nuevo usuario usando el repositorio
      const newUser = await this.userRepository.create(payload);
      return newUser;
    } catch (err) {
      console.error("[CreateUserService]", err);
      const error = new Error("Error creating user");
      (error as any).status = 500; // Internal Server Error
      (error as any).property = "USER";
      throw error;
    }
  }
}
