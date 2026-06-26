import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '@/prisma/prisma.module';
import { join } from 'path';
// GUARDS
import { AtGuard } from '@/modules/auth/common/guards/at.guard';
//MODULES
import { AuthModule } from '@/modules/auth/auth.module';
import { ProductsModule } from '@/modules/products/products.module';
import { SalesModule } from '@/modules/sales/sales.module';
import { PurchasesModule } from '@/modules/purchases/purchases.module';
import { CustomersModule } from '@/modules/customers/customers.module';
import { VisitsModule } from '@/modules/visits/visits.module';
import { ServeStaticModule } from '@nestjs/serve-static';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProductsModule,
    SalesModule,
    PurchasesModule,
    CustomersModule,
    VisitsModule,
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
  ],
})
export class AppModule {}
