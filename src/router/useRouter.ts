import { useState, useEffect } from 'react';

export interface Route {
  path: string;
  params: Record<string, string>;
}

function parsePath(pathname: string): Route {
  const clean = pathname.replace(/^\//, '').replace(/\/$/, '') || '/';

  const instagramMatch = clean.match(/^instagram-captions-for-(.+)$/);
  if (instagramMatch) {
    return { path: '/instagram-captions', params: { slug: instagramMatch[1] } };
  }

  const youtubeMatch = clean.match(/^youtube-video-ideas-for-(.+)$/);
  if (youtubeMatch) {
    return { path: '/youtube-video-ideas', params: { slug: youtubeMatch[1] } };
  }

  const tiktokMatch = clean.match(/^tiktok-hooks-for-(.+)$/);
  if (tiktokMatch) {
    return { path: '/tiktok-hooks', params: { slug: tiktokMatch[1] } };
  }

  const blogMatch = clean.match(/^blog\/(.+)$/);
  if (blogMatch) {
    return { path: '/blog/post', params: { slug: blogMatch[1] } };
  }

  const knownPaths = [
    '/',
    '/ai-caption-generator',
    '/ai-instagram-caption-generator',
    '/ai-youtube-script-generator',
    '/ai-tiktok-caption-generator',
    '/ai-thumbnail-generator',
    '/blog',
  ];

  const fullPath = '/' + (clean === '/' ? '' : clean).replace(/^\//, '');
  if (knownPaths.includes(fullPath)) {
    return { path: fullPath, params: {} };
  }

  return { path: '/', params: {} };
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(() => parsePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parsePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setRoute(parsePath(path));
    window.scrollTo(0, 0);
  };

  return { route, navigate };
}
