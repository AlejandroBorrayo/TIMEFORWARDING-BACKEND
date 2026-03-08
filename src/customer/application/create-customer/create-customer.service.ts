import type { CustomerServiceInterface } from "../../domain/services/customer-service.interface";
import type { UserRepositoryInterface } from "../../../user/domain/repository/user-repository.interface";
import type { CustomerRepositoryInterface } from "../../domain/repositories/customer-repository.interface";
import type { CustomerCollectionInterface } from "../../domain/collection/customer.collection.interface";
import { Types } from "mongoose";
import { CustomerDto } from "../../domain/dto/customer.dto";

export class CreateCustomerService implements CustomerServiceInterface {
  private userRepository: UserRepositoryInterface;
  private customerRepository: CustomerRepositoryInterface;

  constructor(
    userRepository: UserRepositoryInterface,
    customerRepository: CustomerRepositoryInterface
  ) {
    this.userRepository = userRepository;
    this.customerRepository = customerRepository;
  }

  async run(customer: CustomerDto): Promise<any> {
    try {
      // Obtenemos el usuario
      const user = await this.userRepository.findByEmailOrId(
        customer?.creator_userid?.toString()
      );

      if (!user) {
        throw new Error("User not found");
      }

      return await this.customerRepository.create(customer);
    } catch (err) {
      console.error("[TransactionService][run]", err);
      throw err;
    }
  }
}
