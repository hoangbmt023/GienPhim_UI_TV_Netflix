import ENV from '../config/env.config';

export const BASE_URL = ENV.OPHIM_BASE_URL;
export const CDN_IMAGE = ENV.OPHIM_CDN_IMAGE;

export const imgUrl = (filename: string) => {
  if (!filename) return '/placeholder.jpg';
  if (filename.startsWith('http')) return filename;
  return `${CDN_IMAGE}/${filename}`;
};

export const parseItems = (r: any) => {
  const d = r?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  return [];
};

const get = async (path: string) => {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`[OPhim] ${res.status} ${path}`);
  return res.json();
};

const qs = (params: any = {}) => {
  const entries = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  return entries.length > 0 ? `?${entries.join('&')}` : '';
};

export const getHome = () => get('/v1/api/home');

export const getMovieList = (slug = 'phim-moi', opts = {}) => {
  const q = qs({ page: 1, ...opts });
  return get(`/v1/api/danh-sach/${slug}${slug.includes('?') ? q.replace('?', '&') : q}`);
};

export const getByCountry = (slug: string, opts = {}) => {
  const q = qs({ page: 1, ...opts });
  return get(`/v1/api/quoc-gia/${slug}${slug.includes('?') ? q.replace('?', '&') : q}`);
};

export const getByCategory = (slug: string, opts = {}) => {
  const q = qs({ page: 1, ...opts });
  return get(`/v1/api/the-loai/${slug}${slug.includes('?') ? q.replace('?', '&') : q}`);
};

export const searchMovies = (keyword: string, page = 1, limit = 24, opts = {}) =>
  get(`/v1/api/tim-kiem${qs({ keyword, page, limit, ...opts })}`);

export const getMovieKeywords = (slug: string) => get(`/v1/api/phim/${slug}/keywords`);

export const getMovieImages = (slug: string) => get(`/v1/api/phim/${slug}/images`);

export const getMovieDetail = (slug: string) => get(`/v1/api/phim/${slug}`);

export const getMoviePeoples = (slug: string) => get(`/v1/api/phim/${slug}/peoples`);
