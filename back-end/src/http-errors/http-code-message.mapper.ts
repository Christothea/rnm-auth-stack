import { HttpErrorCode } from '../dtos/http-errors/http-error-code.enum';
import { HttpErrorMsgDto } from '../dtos/http-errors/http-error-msg.dto';

export const HttpErrorCodeToMsgDto: Record<HttpErrorCode, HttpErrorMsgDto> = {
    [HttpErrorCode.ERR_AUTH_TOKEN_EXPIRED]: new HttpErrorMsgDto({code: HttpErrorCode.ERR_AUTH_TOKEN_EXPIRED, message: 'Auth token expired'}),
    [HttpErrorCode.ERR_UNAUTHORIZED]: new HttpErrorMsgDto({code: HttpErrorCode.ERR_UNAUTHORIZED, message: 'No auth token provided'}),
    [HttpErrorCode.ERR_UNAUTHORIZED_INVALID_USER]: new HttpErrorMsgDto({code: HttpErrorCode.ERR_UNAUTHORIZED_INVALID_USER, message: 'Invalid Email'}),
    [HttpErrorCode.ERR_UNAUTHORIZED_INVALID_PASSWORD]: new HttpErrorMsgDto({code: HttpErrorCode.ERR_UNAUTHORIZED_INVALID_PASSWORD, message: 'Invalid Password'}),
    [HttpErrorCode.ERR_VALIDATION]: new HttpErrorMsgDto({code: HttpErrorCode.ERR_VALIDATION, message: 'Validation failed', details: []}),
    [HttpErrorCode.ERR_INTERNAL_SERVER_ERROR]: new HttpErrorMsgDto({code: HttpErrorCode.ERR_INTERNAL_SERVER_ERROR, message: 'Please contact sys admin'})
};
