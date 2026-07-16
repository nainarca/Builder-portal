import { Injectable, inject } from '@angular/core';

import { BuilderCommunication, OwnerNotificationContract, OwnerPushNotificationContract } from '../models/communication.model';
import { CommunicationRecipient } from './communication-audience.service';

@Injectable({ providedIn: 'root' })
export class CommunicationDeliveryService {
  private readonly deliveries = new Map<string, OwnerNotificationContract[]>();

  prepareDeliveries(
    communication: BuilderCommunication,
    recipients: readonly CommunicationRecipient[],
  ): readonly OwnerNotificationContract[] {
    const records = recipients.map((recipient) => this.toOwnerNotification(communication, recipient.ownerId));
    this.deliveries.set(communication.id, records);
    return records;
  }

  listOwnerNotifications(ownerId: string): readonly OwnerNotificationContract[] {
    return [...this.deliveries.values()]
      .flat()
      .filter((item) => item.id.startsWith(ownerId) || this.matchesOwner(item, ownerId));
  }

  toPushContracts(communication: BuilderCommunication): readonly OwnerPushNotificationContract[] {
    const deliveries = this.deliveries.get(communication.id) ?? [];
    return deliveries.map((delivery) => ({
      notificationId: delivery.id,
      campaignId: communication.id,
      title: communication.title,
      body: communication.shortDescription,
      priority: communication.priority,
      imageUrl: communication.bannerImageUrl,
      deepLink: communication.cta.internalRoute ?? communication.cta.externalUrl,
      publishedAt: communication.publishedAt ?? new Date().toISOString(),
    }));
  }

  private toOwnerNotification(
    communication: BuilderCommunication,
    ownerId: string,
  ): OwnerNotificationContract {
    return {
      id: `${ownerId}-${communication.id}`,
      campaignId: communication.id,
      organizationId: communication.organizationId,
      communicationType: communication.communicationType,
      title: communication.title,
      shortDescription: communication.shortDescription,
      detailedContent: communication.detailedContent,
      bannerImageUrl: communication.bannerImageUrl,
      attachmentUrl: communication.attachmentUrl,
      priority: communication.priority,
      cta: communication.cta,
      publishedAt: communication.publishedAt ?? new Date().toISOString(),
      expiresAt: communication.expiresAt,
      read: false,
      bookmarked: false,
      archived: false,
    };
  }

  private matchesOwner(item: OwnerNotificationContract, ownerId: string): boolean {
    return item.id.startsWith(`${ownerId}-`);
  }
}
