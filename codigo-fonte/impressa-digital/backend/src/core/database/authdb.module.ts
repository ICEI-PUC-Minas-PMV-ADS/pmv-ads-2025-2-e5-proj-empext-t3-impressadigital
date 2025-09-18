import { Module } from "@nestjs/common";
import { authdbProviders } from "./authdb.provider";


@Module({
  imports: [],
  controllers: [],
  providers: [...authdbProviders],
  exports: [...authdbProviders],
})
export class AuthdbModule {}
