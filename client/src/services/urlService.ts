import type { CreateUrlData, ShortenResponse, Url, UrlsResponse } from '../types';
import api from './api';
import { API_ENDPOINTS } from './endpoints';


export const urlService = {
  getUserUrls: async (): Promise<UrlsResponse> => {
    const response = await api.get(API_ENDPOINTS.URLS.GET_USER_URLS);
    return response.data;
  },

  shortenUrl: async (createUrlData: CreateUrlData): Promise<ShortenResponse> => {
    const response = await api.post(API_ENDPOINTS.URLS.SHORTEN, createUrlData);
    return response.data;
  },

  deleteUrl: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.URLS.DELETE(id));
  },

  getUrlByCode: async (code: string): Promise<{ url: Url }> => {
    const response = await api.get(API_ENDPOINTS.URLS.GET_BY_CODE(code));
    return response.data;
  },


};