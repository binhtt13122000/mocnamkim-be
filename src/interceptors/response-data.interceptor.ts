import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseDataInterceptor implements NestInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (data != 0 && !data) {
          throw new HttpException(
            "The data you requested is not found",
            HttpStatus.NOT_FOUND,
          );
        }
        Logger.debug(
          `Response: \n ${JSON.stringify(data)}`,
          "ResponseDataInterceptor",
        );
        return {
          success: true,
          message: "Retrieved data successfully",
          data: data,
        };
      }),
    );
  }
}
