import { STATUS, MESSAGES } from "../utils/constants";
import { BaseUrlRepository } from "../abstractions/repositoryAbstractions/base.url.repository";
import { UrlRepository } from "../repositories/url.repository";
import { BaseUrlService } from "../abstractions/serviceAbstractions/base.url.service";

export class UrlService extends BaseUrlService {
  private urlRepo: BaseUrlRepository;

  constructor(urlRepo?: BaseUrlRepository) {
    super()
    this.urlRepo = urlRepo ?? new UrlRepository();
  }

  async shortenUrl(originalUrl: string, userId: string) {
    const existingUrl = await this.urlRepo.findByOriginalUrlAndUser(originalUrl, userId);
    if (existingUrl) {
      return {
        shortCode: existingUrl.shortCode,
        originalUrl: existingUrl.originalUrl,
        shortUrl: `${process.env.BASE_URL}/${existingUrl.shortCode}`,
        isExisting: true,
        message: MESSAGES.SHORT_URL.USED,
      };
    }

    const shortCode = Math.random().toString(36).substring(2, 8);
    const newUrl = await this.urlRepo.create({ originalUrl, shortCode, user: userId });

    return {
      shortCode,
      originalUrl,
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
    };
  }

  async redirectUrl(shortCode: string) {
    const url = await this.urlRepo.findByShortCode(shortCode);
    if (!url) {
      throw { status: STATUS.NOT_FOUND, message: MESSAGES.SHORT_URL.URL_NOT_FOUND };
    }

    await this.urlRepo.incrementClicks(url);
    return url.originalUrl;
  }

  async getUserUrls(userId: string, page = 1, limit = 10) {
    const { urls, total } = await this.urlRepo.findByUser(userId, page, limit);
    const baseUrl = process.env.BASE_URL || "";

    const urlsWithShortUrl = urls.map((url) => ({
      ...url.toObject(),
      shortUrl: `${baseUrl}/${url.shortCode}`,
    }));

    return {
      urls: urlsWithShortUrl,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUrlByIdAndUser(urlId: string, userId: string) {
    return this.urlRepo.findByIdAndUser(urlId, userId);
  }

  async deleteUrl(urlId: string, userId: string) {
    const url = await this.getUrlByIdAndUser(urlId, userId);
    if (!url) {
      throw { status: STATUS.NOT_FOUND, message: MESSAGES.SHORT_URL.URL_NOT_FOUND };
    }
    await this.urlRepo.delete(url);
  }
}
