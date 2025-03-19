import ky, { HTTPError } from 'ky';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

let isRefreshing = false;
const pendingRequests: Array<() => void> = [];
/// EXAMPLE with cookies
/*
export const api = ky.extend({
  prefixUrl: 'http://localhost:9000/v1',
  credentials: 'include',
  retry: {
    limit: 2,
    methods: ['get', 'post', 'put', 'delete', 'patch'],
    statusCodes: [401],
  },
  hooks: {
    beforeRetry: [
      async ({ request, error }) => {
        if (!(error instanceof HTTPError) || error.response.status !== 401)
          return;

        const url = new URL(request.url);
        if (url.pathname.endsWith('/auth/refresh')) return;

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            await api.post('auth/refresh');

            pendingRequests.forEach((resolve) => resolve());
            pendingRequests.length = 0;
          } catch (refreshError) {
            pendingRequests.length = 0;
            window.location.href = '/sign-in';
            throw new Error('Token refresh failed');
          } finally {
            isRefreshing = false;
          }
        } else {
          return new Promise<void>((resolve) => {
            pendingRequests.push(resolve);
          });
        }
      },
    ],
  },
});
*/

export const api = ky.extend({
  prefixUrl: 'http://localhost:9000/v1',
});

export function authApi(cookieStore: ReadonlyRequestCookies) {
  const authToken = cookieStore.get('REFRESH_TOKEN');

  return ky.extend({
    prefixUrl: 'http://localhost:9000/v1',
    headers: {
      Authorization: `Bearer ${authToken?.value}`,
    },
  });
}
