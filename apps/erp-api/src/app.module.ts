import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PrismaModule } from '@/prisma/prisma.module';
import { join } from 'path';
// GUARDS
import { AtGuard } from '@/modules/auth/common/guards/at.guard';
// INTERCEPTORS
import { DemoInterceptor } from '@/interceptors/demo.interceptor';
//MODULES
import { AuthModule } from '@/modules/auth/auth.module';
import { ProductsModule } from '@/modules/products/products.module';
import { SalesModule } from '@/modules/sales/sales.module';
import { PurchasesModule } from '@/modules/purchases/purchases.module';
import { CustomersModule } from '@/modules/customers/customers.module';
import { VisitsModule } from '@/modules/visits/visits.module';
import { AccountingModule } from '@/modules/accounting/accounting.module';
import { PayrollModule } from '@/modules/payroll/payroll.module';
import { ManufacturingModule } from '@/modules/manufacturing/manufacturing.module';
import { ServeStaticModule } from '@nestjs/serve-static';
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }],
    }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    SalesModule,
    PurchasesModule,
    CustomersModule,
    VisitsModule,
    AccountingModule,
    PayrollModule,
    ManufacturingModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DemoInterceptor,
    },
  ],
})
export class AppModule {}
