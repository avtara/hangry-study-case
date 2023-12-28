import { Response } from "express";
import { AppErrorCode, HttpStatus, ServerResponse } from "./types";
import Container, { Service } from "typedi";
import { decodeToken, generateToken, verifyToken } from "../utils/jwt.helper";
import { JwtPayload } from "jsonwebtoken";
import { ConfigService } from "../config";

@Service()
export class BaseController {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  protected ok(res: Response, data: any, message: string) {
    return res.status(HttpStatus.Ok).json(
      ServerResponse.OkResponse(data, message),
    );
  }

  protected serverError(
    res: Response,
    code: AppErrorCode,
    errorMessage: string,
    meta: any,
  ) {
    return res
      .status(HttpStatus.InternalServerError)
      .json(ServerResponse.ErrorResponse(code, errorMessage, meta));
  }

  protected created(res: Response, data: any, message: string) {
    return res.status(HttpStatus.Created).json(
      ServerResponse.OkResponse(data, message),
    );
  }

  protected badRequest(
    res: Response,
    code: AppErrorCode,
    errorMessage: string,
    meta?: any,
  ) {
    return res
      .status(HttpStatus.BadRequest)
      .json(ServerResponse.ErrorResponse(code, errorMessage, meta));
  }

  protected unauthorized(
    res: Response,
    code: AppErrorCode,
    errorMessage: string,
    meta: any,
  ) {
    return res
      .status(HttpStatus.Unauthorized)
      .json(ServerResponse.ErrorResponse(code, errorMessage, meta));
  }

  protected forbidden(
    res: Response,
    code: AppErrorCode,
    errorMessage: string,
    meta: any,
  ) {
    return res
      .status(HttpStatus.Forbidden)
      .json(ServerResponse.ErrorResponse(code, errorMessage, meta));
  }

  protected noContent(res: Response) {
    return res.status(HttpStatus.NoContent).json();
  }

  protected notFound(res: Response, code: AppErrorCode, data: any, meta?: any) {
    return res
      .status(HttpStatus.NotFound)
      .json(ServerResponse.ErrorResponse(code, data, meta));
  }

  protected notSupported(
    res: Response,
    code: AppErrorCode,
    errorMessage: string,
    meta: any,
  ) {
    return res
      .status(HttpStatus.MethodNotSupported)
      .json(ServerResponse.ErrorResponse(code, errorMessage, meta));
  }

  public generateAccessToken(
    payload: object | string = {},
    expired: string = "10h",
  ) {
    return generateToken(payload, this.configService.get('jwt_access_token'), expired);
  }

  public verifyAccessToken(
    token: string,
  ): Promise<object | string | undefined> {
    return verifyToken(token, this.configService.get('jwt_access_token'));
  }

  public getUserPayloadFromAccessToken(
    token: string,
  ): JwtPayload | string | null {
    return decodeToken(token);
  }
}
