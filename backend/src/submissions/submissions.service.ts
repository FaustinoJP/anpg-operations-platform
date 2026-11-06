import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubmissionDto, UpdateSubmissionStatusDto } from './dto';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll() {
    return this.prisma.submission.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        operator: { select: { id: true, name: true, code: true } },
        submittedBy: { select: { id: true, name: true, email: true } },
        files: true,
        validationResults: true,
      },
    });
  }

  async create(dto: CreateSubmissionDto, submittedById: string) {
    const operator = await this.prisma.operator.findUnique({ where: { code: dto.operatorCode } });
    if (!operator) throw new NotFoundException('Operador não encontrado.');

    const reference = `SUB-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const submission = await this.prisma.submission.create({
      data: {
        reference,
        operatorId: operator.id,
        submittedById,
        type: dto.type,
        status: 'SUBMITTED',
        periodStart: dto.periodStart ? new Date(dto.periodStart) : null,
        periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : null,
        completenessPercent: 82,
        inconsistencyCount: 2,
        notes: dto.notes,
      },
      include: { operator: true, submittedBy: true, files: true, validationResults: true },
    });

    await this.prisma.validationResult.createMany({
      data: [
        {
          submissionId: submission.id,
          field: 'well_code',
          severity: 'WARNING',
          message: 'Alguns códigos de poço precisam de confirmação.',
        },
        {
          submissionId: submission.id,
          field: 'cost_actual',
          severity: 'ERROR',
          message: 'Existem valores de custo em falta em duas linhas.',
        },
      ],
    });

    await this.auditService.log({
      actorId: submittedById,
      action: 'CREATE_SUBMISSION',
      module: 'SUBMISSIONS',
      entityType: 'Submission',
      entityId: submission.id,
      metadata: { reference, operatorCode: dto.operatorCode, type: dto.type },
    });

    return this.findOne(submission.id);
  }

  async findOne(id: string) {
    const submission = await this.prisma.submission.findUnique({
      where: { id },
      include: {
        operator: { select: { id: true, name: true, code: true } },
        submittedBy: { select: { id: true, name: true, email: true } },
        files: true,
        validationResults: true,
      },
    });

    if (!submission) throw new NotFoundException('Submissão não encontrada.');
    return submission;
  }

  async updateStatus(id: string, dto: UpdateSubmissionStatusDto, actorId: string) {
    const submission = await this.prisma.submission.update({
      where: { id },
      data: { status: dto.status, notes: dto.notes },
      include: { operator: true, submittedBy: true, files: true, validationResults: true },
    });

    await this.auditService.log({
      actorId,
      action: `SUBMISSION_${dto.status}`,
      module: 'SUBMISSIONS',
      entityType: 'Submission',
      entityId: id,
      metadata: { reference: submission.reference, notes: dto.notes },
    });

    return submission;
  }
}
