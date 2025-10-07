export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/api/auth/register',      
    LOGIN: '/api/auth/login',              
    LOGOUT: '/api/auth/logout',          
    ME: '/api/auth/me',                  
    REFRESH_TOKEN: '/api/auth/refresh-token', 
  },
  
  // URL shortener endpoints
  URLS: {
   SHORTEN: '/api/url/shorten',         
    GET_USER_URLS: '/api/url/my',       
    DELETE: (id: string) => `/api/url/${id}`,        
    GET_BY_CODE: (code: string) => `/api/url/${code}`, 
    UPDATE: (id: string) => `/api/url/${id}`,  
  },
} as const;