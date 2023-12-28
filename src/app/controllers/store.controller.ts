import { Request, RequestHandler, Response } from "express";
import Container, { Service } from "typedi";
import { DB_TOKEN } from "../../database";
import { Kysely } from "kysely";
import { DB } from "../../database/generated.types";
import { BaseController } from "../base.controller";
import { AppErrorCode } from "../types";
import { LogService } from "../../logger";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";

@Service()
export class StoresController extends BaseController {
  logService = Container.get(LogService);

  getAllStore: RequestHandler = async (req: Request, res: Response) => {
    try {
      let { name, limit } = req.query;

      if (!limit) {
        limit = "10";
      }

      const db = Container.get(DB_TOKEN) as Kysely<DB>;
      const storess = await db
        .selectFrom("stores")
        .select((a) => [
          "id",
          "name",
          "latitude",
          "longitude",
        ])
        .where((eb) =>
          eb.or([
            eb("name", "like", `%${name}%"`),
            eb("deleted_at", "is", null),
          ])
        ).limit(parseInt(limit as string, 10))
        .execute();

      const stores = await db
        .selectFrom("stores")
        .select(["name", "latitude", "longitude"])
        .select((eb) => [
          jsonArrayFrom(
            eb.selectFrom("store_menus")
              .select(["availability"])
              .whereRef("store_menus.store_id", "=", "stores.id").select(["menus.id","menus.name", "menus.price", "menus.description", "menus.image"]).innerJoin("menus", "menus.id", "store_menus.menu_id")
          ).as("menu"),
        ])
        .execute();

        if (!stores) {
          const message = "Data not found!";
          return this.notFound(
            res,
            AppErrorCode.SERVER_UNSUPPORTED_OPERATION,
            message,
            null,
          );
        }

      const message = "Success get data!";
      return this.ok(res, stores, message);
    } catch (error: any) {
      this.logService.error(error.message, "[StoreController][getAllStore]");
      return this.serverError(
        res,
        AppErrorCode.SERVER_FAILURE,
        error.message,
        undefined,
      );
    }
  };
}
