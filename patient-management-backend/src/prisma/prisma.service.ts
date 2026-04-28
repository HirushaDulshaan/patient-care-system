import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config'; // .env file eken DATABASE_URL eka load karaganna meka aniwaryai

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. PostgreSQL database ekata connect wenna pool ekak hadanawa
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });

    // 2. PrismaPg adapter eka hadanawa
    const adapter = new PrismaPg(pool);

    // 3. PrismaClient base class ekata adapter eka pass karanawa
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}

