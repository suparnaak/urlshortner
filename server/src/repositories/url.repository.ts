import { Url, UrlDocument } from "../models/url.model";
import { BaseUrlRepository } from "../abstractions/repositoryAbstractions/base.url.repository";

export class UrlRepository extends BaseUrlRepository {
  async findByOriginalUrlAndUser(originalUrl: string, userId: string) {
    return Url.findOne({ originalUrl, user: userId });
  }

  async create(data: Partial<UrlDocument>) {
    return Url.create(data);
  }

  async findByShortCode(shortCode: string) {
    return Url.findOne({ shortCode });
  }

  async incrementClicks(url: UrlDocument) {
    url.clicks += 1;
    await url.save();
  }

  async findByUser(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [urls, total] = await Promise.all([
      Url.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Url.countDocuments({ user: userId }),
    ]);
    return { urls, total };
  }

  async findByIdAndUser(urlId: string, userId: string) {
    return Url.findOne({ _id: urlId, user: userId });
  }

  async delete(url: UrlDocument) {
    await url.deleteOne();
  }
}
