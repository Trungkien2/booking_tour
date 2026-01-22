import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  /**
   * Prisma delegate proxies will be attached dynamically (e.g. this.user, this.booking...).
   * This keeps tests runnable even if Prisma Client hasn't been generated yet.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any;

  async onModuleInit() {
    // Lazy-load PrismaClient to avoid crashing test/runtime when client hasn't been generated.
    // If Prisma Client is not generated, this will throw at runtime when the real app starts.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prismaPkg: any = await import('@prisma/client');
    const PrismaClient = prismaPkg.PrismaClient;

    this.client = new PrismaClient();
    await this.client.$connect();

    // Attach delegates/methods onto this service (e.g. this.user.findUnique).
    Object.assign(this, this.client);
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.$disconnect();
    }
  }
}
