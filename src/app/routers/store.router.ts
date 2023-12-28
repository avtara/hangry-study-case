import { Router } from "express";
import { Service } from "typedi";
import { AuthorizationService } from "../controllers/auth.controller";
import { StoresController } from "../controllers/store.controller";

@Service()
export class StoreRoutes {
  constructor(
    private readonly store: StoresController,
  ) {}

  routes() {
    const router = Router();

    router.get("/", this.store.getAllStore);
    return router;
  }
}
