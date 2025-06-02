import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ResponseInterceptor } from "./interceptors/response.interceptor";
import { GlobalExceptionFilter } from "./exceptions/globalException";
import { ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwtAuth.guard";
import { RolesGuard } from "./guards/role.guard";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as fileUpload from "express-fileupload";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true, // when we need to set cookies
  });
  app.use(cookieParser());
  app.use(fileUpload());

  //validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Global Exceptions Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  //Response Interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global Auth Guard (JWT)
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  const config = new DocumentBuilder()
    .setTitle("My API")
    .setDescription("The API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  app.setGlobalPrefix("api");

  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
