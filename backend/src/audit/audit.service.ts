import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type AuditLogInput = {
  actorId?: string | null;
  action: string;
  module: string;
  entityType?: string | null;
  entityId?: string | null;
  ipAddress?: string | null;
  metadata?: Record<string, any>;
};

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(input: AuditLogInput) {
    return this.prisma.auditLog.create({
      data: {
        actorId: input.actorId || null,
        action: input.action,
        module: input.module,
        entityType: input.entityType || null,
        entityId: input.entityId || null,
        ipAddress: input.ipAddress || null,
        metadata: input.metadata || {},
      },
    });
  }

  async findRecent(limit = 50) {
    return this.prisma.auditLog.findMany({
      take: Math.min(limit, 100),
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async summary() {
    const [total, last24h, byModule] = await Promise.all([
      this.prisma.auditLog.count(),
      this.prisma.auditLog.count({
        where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
      this.prisma.auditLog.groupBy({
        by: ['module'],
        _count: { module: true },
        orderBy: { _count: { module: 'desc' } },
      }),
    ]);

    return { total, last24h, byModule };
  }
}
