import ENV from '../config/env.config';

export const BASE_URL = ENV.OPHIM_BASE_URL;
export const CDN_IMAGE = ENV.OPHIM_CDN_IMAGE;

export const imgUrl = (filename: string) =>
  filename ? `${CDN_IMAGE}/${filename}` : '/placeholder.jpg';

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

export const getMovieImages = (slug: string) => get(`/v1/api/phim/${slug}/images`);

export const getMovieDetail = (slug: string) => get(`/v1/api/phim/${slug}`);
