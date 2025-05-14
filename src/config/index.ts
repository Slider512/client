const isProduction = process.env.NODE_ENV === 'production';

export const config = {
  baseUrl: isProduction ? 'https://your-production-api.com' : 'http://localhost:5000',
};