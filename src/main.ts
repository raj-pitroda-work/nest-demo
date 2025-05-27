import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ResponseInterceptor } from "./interceptors/response.interceptor";
import { GlobalExceptionFilter } from "./exceptions/globalException";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Exceptions Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  //Response Interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
