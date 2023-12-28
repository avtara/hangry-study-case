import { Router } from "express";
import { Service } from "typedi";
import { AuthorizationService } from "../controllers/auth.controller";
import { Middlewares } from "../middlewares";

@Service()
export class ProtectedRoute {
  constructor(
    private readonly auth: AuthorizationService,
    private readonly middleware: Middlewares,
  ) {}

  routes() {
    const router = Router();

    router.post("/",this.middleware.isProtectedRoute.bind(this.middleware),this.auth.register);
    return router;
  }
}
