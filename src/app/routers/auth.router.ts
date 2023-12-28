import { Router } from "express";
import { Service } from "typedi";
import { AuthorizationService } from "../controllers/auth.controller";

@Service()
export class AuthRoute {
  constructor(
    private readonly auth: AuthorizationService,
  ) {}

  routes() {
    const router = Router();

    router.post("/register", this.auth.register);
    router.post("/login", this.auth.login);
    return router;
  }
}
