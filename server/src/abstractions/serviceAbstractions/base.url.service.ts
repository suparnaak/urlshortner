export abstract class BaseUrlService {
  abstract shortenUrl(
    originalUrl: string, 
    userId: string
  ): Promise<{
    shortCode: string;
    originalUrl: string;
    shortUrl: string;
    isExisting?: boolean;
    message?: string;
  }>;
  
  abstract redirectUrl(shortCode: string): Promise<string>;
  
  abstract getUserUrls(
    userId: string, 
    page?: number, 
    limit?: number
  ): Promise<{
    urls: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  
  abstract getUrlByIdAndUser(urlId: string, userId: string): Promise<any>;
  
  abstract deleteUrl(urlId: string, userId: string): Promise<void>;
}