// src/core/database/authdb.module.ts
import { Module } from "@nestjs/common";
import { authdbProviders } from "./authdb.provider";

@Module({
  providers: [...authdbProviders],
  exports: [...authdbProviders], // 👈 exporta para outros módulos
})
export class AuthdbModule {}
