import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const buildTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST') ?? 'localhost',
  port: configService.get('DB_PORT') ?? 3306,
  username: configService.get('DB_USER') ?? 'root',
  password: configService.get('DB_PASSWORD') ?? 'pwd',
  database: configService.get('DB_NAME') ?? 'database',
  autoLoadEntities: true,
  synchronize: configService.get('NODE_ENV') !== 'production',
});
