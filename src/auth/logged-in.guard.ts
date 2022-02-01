import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoggedInGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // guard는 true를 반환하냐 false를 반환하냐에 따라서 다음 컨트롤러를
    // 쓸 수 있냐 없냐가 정해진다.
    // request.isAuthenticated()이 true를 반환하면 로그인 한 사용자만
    // 사용할 수 있도록 구현할 수 있다
    // login을 하지 않으면 request.isAuthenticated()이 false를 반환하므로
    // 다음 컨트롤러를 쓰지 못하게 된다.
    return request.isAuthenticated();
  }
}
