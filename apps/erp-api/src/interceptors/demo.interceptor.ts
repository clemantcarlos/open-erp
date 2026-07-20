import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import type { Request } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class DemoInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { sub?: string; email?: string; role?: string } | undefined;

    if (user?.role !== 'demo') return next.handle();

    const method = request.method;
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return next.handle();

    const body = request.body ?? {};

    if (method === 'POST') {
      return of({
        id: crypto.randomUUID(),
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    if (method === 'PATCH' || method === 'PUT') {
      return of({
        ...body,
        updatedAt: new Date().toISOString(),
      });
    }

    if (method === 'DELETE') {
      return of({ message: 'Deleted (demo)' });
    }

    return next.handle();
  }
}
