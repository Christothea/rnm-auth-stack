import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpErrorMsgDto } from '../dtos/http-errors/http-error-msg.dto';
import { LoggingService } from '../logging/logging.service';
import { HttpErrorCodeToMsgDto } from './http-code-message.mapper';

/**
 * @class
 * @name HttpErrorsFilter
 * @description Catches the uncaught exceptions thrown from any Controller
 * @description Centralizes the error messages returned in each case
 */
@Catch()
export class HttpErrorsFilter implements ExceptionFilter {
  private loggingService: LoggingService = new LoggingService(HttpErrorsFilter.name);

  /**
   * @method
   * @name catch
   * @description catches, uncaught controllers exceptions
   */
  catch(error: any, host: ArgumentsHost) {
    this.loggingService.warn(error);

    const response = host.switchToHttp().getResponse();
    const status: HttpStatus = (error instanceof HttpException) ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    let respError: HttpErrorMsgDto;

    if (!(error instanceof HttpException)) {
      respError = HttpErrorCodeToMsgDto.ERR_INTERNAL_SERVER_ERROR;
    } else if (status === HttpStatus.BAD_REQUEST) {
      respError = this.processBadRequestException(error as HttpException);
    } else if (error.getResponse() instanceof HttpErrorMsgDto) {
      respError = error.getResponse() as HttpErrorMsgDto;
    } else {
      switch (status) {
        case HttpStatus.UNAUTHORIZED:
          respError = HttpErrorCodeToMsgDto.ERR_UNAUTHORIZED;
          break;
        default:
          respError = HttpErrorCodeToMsgDto.ERR_INTERNAL_SERVER_ERROR;
          break;
      }
    }

    return response.status(status).send(respError);
  }

  private processBadRequestException(error: any): HttpErrorMsgDto {
    const respError: HttpErrorMsgDto = (error.getResponse() instanceof HttpErrorMsgDto) ? error.getResponse() as HttpErrorMsgDto : new HttpErrorMsgDto({ ...HttpErrorCodeToMsgDto.ERR_VALIDATION });

    if (Array.isArray(error.getResponse().message)) {
      respError.message = error.getResponse().message.join(',');
    }

    return respError;
  }
}