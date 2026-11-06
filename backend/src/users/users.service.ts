import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        role: { select: { id: true, name: true, description: true } },
        operator: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async create(dto: CreateUserDto, actorId?: string) {
    const role = await this.prisma.role.findUnique({ where: { name: dto.roleName } });
    if (!role) throw new NotFoundException('Perfil não encontrado.');

    const operator = dto.operatorCode
      ? await this.prisma.operator.findUnique({ where: { code: dto.operatorCode } })
      : null;

    if (dto.operatorCode && !operator) throw new NotFoundException('Operador não encontrado.');

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (existing) throw new BadRequestException('Já existe um utilizador com este email.');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        passwordHash,
        roleId: role.id,
        operatorId: operator?.id,
      },
      include: { role: true, operator: true },
    });

    await this.auditService.log({
      actorId,
      action: 'CREATE_USER',
      module: 'USERS',
      entityType: 'User',
      entityId: user.id,
      metadata: { email: user.email, role: role.name },
    });

    const { passwordHash: _, ...publicUser } = user;
    return publicUser;
  }
}
