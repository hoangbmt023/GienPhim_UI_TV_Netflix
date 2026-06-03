const ENV = {
  API_URL: process.env.API_URL || 'http://localhost:8080',
  OPHIM_BASE_URL: process.env.OPHIM_BASE_URL || 'https://ophim1.com',
  OPHIM_CDN_IMAGE: process.env.OPHIM_CDN_IMAGE || 'https://img.ophim.live/uploads/movies',
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
  IS_PROD: !__DEV__,
};

export default ENV;
