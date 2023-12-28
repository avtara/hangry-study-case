import { ErrorRequestHandler, NextFunction, RequestHandler } from 'express';
import { Service } from 'typedi';
import { BaseController } from './base.controller';
import { AppErrorCode } from './types';

@Service()
export class Middlewares extends BaseController {
  onGlobalError: ErrorRequestHandler = (err, req, res) => {
    console.error(err);
    return this.serverError(res, AppErrorCode.SERVER_FAILURE, "", "");
  };

  onNotFound: RequestHandler = (req, res) => {
    return this.notFound(res, AppErrorCode.SERVER_UNSUPPORTED_OPERATION, "", "");
  };

  isProtectedRoute: RequestHandler = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) return this.badRequest(res, AppErrorCode.SERVER_NOT_REACHABLE, 'Token invalid', "");

      try {
          await this.verifyAccessToken(token);
          
          next();
          return;
      } catch (error: any) {
          return this.badRequest(res, AppErrorCode.SERVER_NOT_REACHABLE, 'Token invalid', "");
      }
  } catch (error: any) {
      return this.badRequest(res, AppErrorCode.SERVER_NOT_REACHABLE, 'Token Unauthorized', "");
  }
  }
}
