import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ResponseInterceptor } from "./interceptors/response.interceptor";
import { GlobalExceptionFilter } from "./exceptions/globalException";
import { ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwtAuth.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Global Exceptions Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  //Response Interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global Auth Guard (JWT)
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
