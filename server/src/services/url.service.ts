import { Url } from '../models/url.model';
import { STATUS, MESSAGES } from '../utils/constants';

export class UrlService {
  async shortenUrl(originalUrl: string, userId: string) {

    const existingUrl = await Url.findOne({ 
      originalUrl, 
      user: userId 
    });

    if (existingUrl) {
      return {
        shortCode: existingUrl.shortCode,
        originalUrl: existingUrl.originalUrl,
        shortUrl: `${process.env.BASE_URL}/${existingUrl.shortCode}`,
        isExisting: true,
        message: MESSAGES.SHORT_URL.USED
      };
    }
  
    const shortCode = Math.random().toString(36).substring(2, 8);


    const newUrl = await Url.create({
      originalUrl,
      shortCode,
      user: userId
    });

    return {
      shortCode,
      originalUrl,
      shortUrl: `${process.env.BASE_URL}/${shortCode}`
    };
  }

  async redirectUrl(shortCode: string) {
    const url = await Url.findOne({ shortCode });

    if (!url) {
      throw { status: STATUS.NOT_FOUND, message: MESSAGES.GENERAL.SERVER_ERROR };
    }

    url.clicks += 1;
    await url.save();

    return url.originalUrl;
  }

  async getUserUrls(userId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const [urls, total] = await Promise.all([
    Url.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Url.countDocuments({ user: userId }),
  ]);

  const baseUrl = process.env.BASE_URL || ''; 

  const urlsWithShortUrl = urls.map(url => ({
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
  return await Url.findOne({ _id: urlId, user: userId });
}

}
