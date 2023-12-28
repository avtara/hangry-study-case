import { Request, RequestHandler, Response } from "express";
import Container, { Service } from "typedi";
import { DB_TOKEN } from "../../database";
import { Kysely, sql } from "kysely";
import { DB } from "../../database/generated.types";
import { BaseController } from "../base.controller";
import { AppErrorCode } from "../types";
import { LogService } from "../../logger";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AddItemBodyRequestSchema } from "../validations";
import { formatZodErrors } from "../../utils";

@Service()
export class CartController extends BaseController {
  logService = Container.get(LogService);
  private token: string;
  private jwtPayload: jwt.JwtPayload;

  GetActiveCart: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { authorization } = req.headers;
      if (authorization?.startsWith("Bearer ")) {
        this.token = authorization.substring(7, authorization.length);
        this.jwtPayload = this.getUserPayloadFromAccessToken(
          this.token,
        ) as JwtPayload;
      }

      const db = Container.get(DB_TOKEN) as Kysely<DB>;
      const cart = await db
        .selectFrom("carts").innerJoin(
          "cart_items",
          "carts.id",
          "cart_items.cart_id",
        ).innerJoin("stores", "carts.store_id", "stores.id").select((
          { fn, eb, ref },
        ) => [
            "cart_id",
          "stores.name",
          "carts.status",
          jsonArrayFrom(
            eb.selectFrom("menus").innerJoin(
              "cart_items",
              "cart_items.menu_id",
              "menus.id",
            ).select([
              "menus.name",
              "cart_items.price",
              "menus.image",
              "cart_items.quantity",
              sql<string>`
                    ${ref("cart_items.price")}
                    *
                    ${ref("cart_items.quantity")}
                  `.as("totalPrice"),
            ])
            .whereRef("cart_items.cart_id", "=", "carts.id")
          ).as("detail"),
        ]).where((eb) =>
          eb.and([
            eb("user_id", "=", this.jwtPayload.id),
            eb("status", "=", "active"),
          ])
        )
        .execute();

      if (!cart.toString()) {
        const message = "Data not found!";
        return this.notFound(
          res,
          AppErrorCode.SERVER_UNSUPPORTED_OPERATION,
          message,
          null,
        );
      }

      const message = "Success get data!";
      return this.ok(res, cart, message);
    } catch (error: any) {
      this.logService.error(error.message, "[CartController][GetActiveCart]");
      return this.serverError(
        res,
        AppErrorCode.SERVER_FAILURE,
        error.message,
        undefined,
      );
    }
  };

  AddItem: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id, quantity } = req.body;
      const item = { id, quantity };
      const { authorization } = req.headers;

      const validationCheck = AddItemBodyRequestSchema.safeParse(item);
      if (!validationCheck.success) {
        const message = "Wrong body request!";
        return this.badRequest(
          res,
          AppErrorCode.SERVER_NOT_REACHABLE,
          message,
          formatZodErrors(validationCheck.error),
        );
      }

      if (authorization?.startsWith("Bearer ")) {
        const token = authorization.substring(7, authorization.length);
        this.jwtPayload = this.getUserPayloadFromAccessToken(
          token,
        ) as JwtPayload;
      }

      const { storeId } = req.params;

      const db = Container.get(DB_TOKEN) as Kysely<DB>;

      const store = await db.selectFrom("stores").select("id").where((eb) =>
        eb.and([
          eb("id", "=", parseInt(storeId)),
          eb("is_active", "=", true),
          eb("stores.deleted_at", "is", null),
        ])
      ).executeTakeFirst();

      if (!store) {
        const message = "Store not found!";
        return this.badRequest(res, AppErrorCode.SERVER_NOT_REACHABLE, message);
      }

      let cart = await db.selectFrom("carts").select(["id", "store_id"])
        .where((eb) =>
          eb.and([
            eb("user_id", "=", this.jwtPayload.id),
            eb("status", "=", "active"),
            eb("carts.deleted_at", "is", null),
          ])
        ).executeTakeFirst();

      if (cart) {
        if (parseInt(storeId) != cart?.store_id) {
          const message = "Store not match, please delete cart first!";
          return this.badRequest(
            res,
            AppErrorCode.SERVER_NOT_REACHABLE,
            message,
          );
        }
      }

      if (!cart) {
        cart = await db.insertInto("carts").values({
          status: "active",
          user_id: this.jwtPayload.id,
          store_id: parseInt(storeId),
        }).returning(["id", "store_id"]).executeTakeFirst();
      }

      const menu = await db.selectFrom("menus").innerJoin(
        "store_menus",
        "store_menus.menu_id",
        "menus.id",
      ).select(["menus.id", "menus.price"]).where((eb) =>
        eb.and([
          eb("menus.id", "=", id),
          eb("menus.is_active", "=", true),
          eb("store_menus.availability", "=", true),
          eb("menus.deleted_at", "is", null),
        ])
      ).executeTakeFirst();

      if (!menu) {
        const message = "Menu not unavailable!";
        return this.badRequest(res, AppErrorCode.SERVER_NOT_REACHABLE, message);
      }
      
      const cart_items = await db.selectFrom("cart_items").select([
        "id",
        "cart_items.menu_id",
        "quantity",
      ]).where((eb) =>
        eb.and([
          eb("menu_id", "=", id),
          eb("cart_id", "=", cart!.id),
          eb("is_active", "=", true),
          eb("deleted_at", "is", null),
        ])
      ).executeTakeFirst();

      if (!cart_items) {
        const cart_items = await db.insertInto("cart_items").values({
          menu_id: menu.id,
          cart_id: cart?.id,
          price: menu.price,
          quantity: quantity
        }).returning(["id", "quantity"]).executeTakeFirst();

        const message = "Success created data!";
        return this.created(res, cart_items, message);
      }

      const updateCart = await db.updateTable("cart_items").set(
        {
          price: menu.price,
          menu_id: menu.id,
          quantity: cart_items.quantity + quantity,
        },
      ).where(
        "id",
        "=",
        cart_items.id,
      ).returning(["id", "quantity"]).executeTakeFirst();

      //TODO: Return OK
      const message = "Success update data!";
      return this.ok(res, updateCart, message);
    } catch (error: any) {
      this.logService.error(error.message, "[CartController][GetActiveCart]");
      return this.serverError(
        res,
        AppErrorCode.SERVER_FAILURE,
        error.message,
        undefined,
      );
    }
  };

  Delete: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { id, quantity } = req.body;
      const item = { id, quantity };
      const { authorization } = req.headers;

      if (authorization?.startsWith("Bearer ")) {
        this.token = authorization.substring(7, authorization.length);
        this.jwtPayload = this.getUserPayloadFromAccessToken(
          this.token,
        ) as JwtPayload;
      }

      const { storeId } = req.params;

      const db = Container.get(DB_TOKEN) as Kysely<DB>;

      const cart = await db.selectFrom("carts").select(["id", "store_id"])
        .where((eb) =>
          eb.and([
            eb("user_id", "=", this.jwtPayload.id),
            eb("status", "=", "active"),
            eb("carts.deleted_at", "is", null),
          ])
        ).executeTakeFirst();

      if (!cart) {
        const message = "Cart already deleted!";
        return this.notFound(
          res,
          AppErrorCode.SERVER_NOT_REACHABLE,
          message,
        );
      }

      const updateCart = await db.updateTable("carts").set({
        status: "inactive",
      }).where((eb) =>
        eb.and([
          eb("user_id", "=", this.jwtPayload.id),
          eb("status", "=", "active"),
        ])
      ).executeTakeFirst();

      //TODO: Return OK
      const message = "Success delete data!";
      return this.ok(res, {}, message);
    } catch (error: any) {
      this.logService.error(error.message, "[CartController][GetActiveCart]");
      return this.serverError(
        res,
        AppErrorCode.SERVER_FAILURE,
        error.message,
        undefined,
      );
    }
  };
}
