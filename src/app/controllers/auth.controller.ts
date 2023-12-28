import { Request, RequestHandler, Response } from "express";
import Container, { Service } from "typedi";
import { DB_TOKEN } from "../../database";
import { Kysely } from "kysely";
import { DB } from "../../database/generated.types";
import { BaseController } from "../base.controller";
import { AppErrorCode } from "../types";
import { LogService } from "../../logger";
import { compare, hash } from "../../utils/hash.helper";
import {
  LoginBodyRequestSchema,
  RegisterBodyRequestSchema,
} from "../validations";
import { formatZodErrors } from "../../utils";

@Service()
export class AuthorizationService extends BaseController {
  logService = Container.get(LogService);

  register: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const userData = { name, email, password };

      const validationCheck = RegisterBodyRequestSchema.safeParse(userData);
      if (!validationCheck.success) {
        const message = "Wrong body request!";
        return this.badRequest(
          res,
          AppErrorCode.SERVER_NOT_REACHABLE,
          message,
          formatZodErrors(validationCheck.error),
        );
      }

      const db = Container.get(DB_TOKEN) as Kysely<DB>;
      const user = await db
        .selectFrom("users")
        .select([
          "id",
        ])
        .where((eb) =>
          eb.and([
            eb("email", "=", email),
            eb("deleted_at", "is", null),
          ])
        )
        .executeTakeFirst();

      if (user) {
        const message = "Email already registered!";
        return this.badRequest(
          res,
          AppErrorCode.SERVER_UNSUPPORTED_OPERATION,
          message,
          null,
        );
      }

      const hashPassword = await hash(password);

      const newUser = await db.insertInto("users").values({
        name: name,
        email: email,
        password: hashPassword,
      }).returningAll().executeTakeFirst();

      const message = "Register user success!";
      const data = {
        name: newUser?.name,
        email: newUser?.email,
        accessToken: this.generateAccessToken({ id: newUser?.id }),
      };
      return this.created(res, data, message);
    } catch (error: any) {
      this.logService.error(error.message, "[AuthorizationService][Register]");
      let message = error.message;
      if (error.code === '23505') {
        message = "Email already registered!"
        return this.badRequest(
          res,
          AppErrorCode.SERVER_FAILURE,
          message,
          undefined,
        );
      }
      return this.serverError(
        res,
        AppErrorCode.SERVER_FAILURE,
        error.message,
        undefined,
      );
    }
  };
  login: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const userData = { email, password };

      const validationCheck = LoginBodyRequestSchema.safeParse(userData);
      if (!validationCheck.success) {
        const message = "Wrong body request!";
        return this.badRequest(
          res,
          AppErrorCode.SERVER_NOT_REACHABLE,
          message,
          formatZodErrors(validationCheck.error),
        );
      }

      const db = Container.get(DB_TOKEN) as Kysely<DB>;
      const user = await db
        .selectFrom("users")
        .select([
          "id",
          "email",
          "password",
          "name",
        ])
        .where((eb) =>
          eb.and([
            eb("email", "=", email),
            eb("deleted_at", "is", null),
          ])
        )
        .executeTakeFirst();

      if (!user) {
        const message = "User not found, please register!";
        return this.badRequest(
          res,
          AppErrorCode.SERVER_UNSUPPORTED_OPERATION,
          message,
          null,
        );
      }

      if (!await compare(password, user.password)) {
        const message = "Wrong Password!";
        return this.badRequest(
          res,
          AppErrorCode.SERVER_UNSUPPORTED_OPERATION,
          message,
          null,
        );
      }

      const message = "Login user success!";
      const data = {
        name: user?.name,
        email: user?.email,
        accessToken: this.generateAccessToken({ id: user?.id }),
      };
      return this.created(res, data, message);
    } catch (error: any) {
      this.logService.error(error.message, "[AuthorizationService][Login]");
      return this.serverError(
        res,
        AppErrorCode.SERVER_FAILURE,
        error.message,
        undefined,
      );
    }
  };
}
