export enum HttpStatus {
    NotFound = 404,
    NoContent = 204,
    Ok = 200,
    Created = 201,
    InternalServerError = 500,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    MethodNotSupported = 405,
  }
  
  export enum AppErrorCode {
    NO_ERROR = 0,
    SERVER_NOT_REACHABLE = 5000,
    SERVER_FAILURE = 5001,
    SERVER_UNSUPPORTED_OPERATION = 5002,
  }
  
  export class ServerResponse {
    public data?: any = undefined;
    public success: boolean;
    public errorCode: AppErrorCode;
    public message?: string = undefined;;
    public meta?: any = undefined;
  
    static OkResponse(data: any, message: string) {
      const response = new ServerResponse();
      response.success = true;
      response.errorCode = AppErrorCode.NO_ERROR;
      response.data = data;
      response.message = message;
      return response;
    }
  
    static ErrorResponse(appErrorCode: AppErrorCode, errorMessage: string, meta: any) {
      const response = new ServerResponse();
      response.success = false;
      response.errorCode = appErrorCode;
      response.message = errorMessage;
      response.meta = meta;
      return response;
    }
  }
  