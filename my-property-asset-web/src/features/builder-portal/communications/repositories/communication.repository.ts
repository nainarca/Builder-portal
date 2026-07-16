import {
  BuilderCommunication,
  CommunicationAuditEvent,
  CommunicationFormModel,
  CommunicationListQuery,
  CommunicationListResult,
} from '../models/communication.model';

export abstract class CommunicationRepository {
  abstract list(organizationId: string, query: CommunicationListQuery): CommunicationListResult;
  abstract getById(id: string): BuilderCommunication | undefined;
  abstract create(
    organizationId: string,
    model: CommunicationFormModel,
    actorLabel: string,
  ): BuilderCommunication;
  abstract update(
    id: string,
    model: CommunicationFormModel,
    actorLabel: string,
  ): BuilderCommunication | undefined;
  abstract publish(id: string, actorLabel: string, publishAt?: string): BuilderCommunication | undefined;
  abstract schedule(id: string, actorLabel: string, publishAt: string): BuilderCommunication | undefined;
  abstract archive(id: string, actorLabel: string): BuilderCommunication | undefined;
  abstract cancel(id: string, actorLabel: string): BuilderCommunication | undefined;
  abstract disable(id: string, actorLabel: string): BuilderCommunication | undefined;
  abstract softDelete(id: string, actorLabel: string): BuilderCommunication | undefined;
  abstract setRecipientCount(id: string, count: number): void;
  abstract listAudit(campaignId: string): readonly CommunicationAuditEvent[];
  abstract listAll(organizationId?: string): readonly BuilderCommunication[];
}
