import { Router } from "express";
import { Service } from "typedi";
import { Middlewares } from "../middlewares";
import { CartController } from "../controllers/cart.controller";

@Service()
export class CartRouter {
  constructor(
    private readonly cart: CartController,
    private readonly middleware: Middlewares,
  ) {}

  routes() {
    const router = Router();

    router.get(
      "/",
      this.middleware.isProtectedRoute.bind(this.middleware),
      this.cart.GetActiveCart,
    );
    router.post(
        "/:storeId/add",
        this.middleware.isProtectedRoute.bind(this.middleware),
        this.cart.AddItem,
    )
    router.delete(
        "/",
        this.middleware.isProtectedRoute.bind(this.middleware),
        this.cart.Delete,
    )
    router.post(
        "/checkout",
        this.middleware.isProtectedRoute.bind(this.middleware),
        this.cart.Checkout,
    )
    return router;
  }
}
