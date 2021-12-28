import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";

import { AppError } from "@shared/errors/AppError";

import { CreateUserUseCase } from "../createUser/CreateUserCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;

let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      driver_license: "valid_driver_license",
      email: "valid_email@email.com",
      password: "valid_password",
      name: "valid_name",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate  an nonexistent user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "invalid_email@email.com",
        password: "invalid_password",
      })
    ).rejects.toEqual(new AppError("Email or password incorrect.", 401));
  });

  it("should not be able to authenticate with incorrect password", async () => {
    const user: ICreateUserDTO = {
      driver_license: "valid_driver_license",
      email: "valid_email@email.com",
      password: "valid_password",
      name: "valid_name",
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "invalid_password",
      })
    ).rejects.toEqual(new AppError("Email or password incorrect.", 401));
  });

  it("should not be able to authenticate with incorrect email", async () => {
    const user: ICreateUserDTO = {
      driver_license: "valid_driver_license",
      email: "valid_email@email.com",
      password: "valid_password",
      name: "valid_name",
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: "invalid_email@email.com",
        password: user.password,
      })
    ).rejects.toEqual(new AppError("Email or password incorrect.", 401));
  });
});
