import { UrlDocument } from "../../models/url.model";

export abstract class BaseUrlRepository {
  abstract findByOriginalUrlAndUser(originalUrl: string, userId: string): Promise<UrlDocument | null>;
  abstract create(data: Partial<UrlDocument>): Promise<UrlDocument>;
  abstract findByShortCode(shortCode: string): Promise<UrlDocument | null>;
  abstract incrementClicks(url: UrlDocument): Promise<void>;
  abstract findByUser(userId: string, page: number, limit: number): Promise<{ urls: UrlDocument[], total: number }>;
  abstract findByIdAndUser(urlId: string, userId: string): Promise<UrlDocument | null>;
  abstract delete(url: UrlDocument): Promise<void>;
}
