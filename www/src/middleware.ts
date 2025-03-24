import ky from 'ky';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TToken } from './lib/types';
import { api } from './lib/api';

export async function middleware(request: NextRequest) {
  console.log('hello from middleware');
  const access_token = request.cookies.get('ACCESS_TOKEN');
  const refresh_token = request.cookies.get('REFRESH_TOKEN');

  if (!refresh_token) {
    return NextResponse.redirect('/sign-in');
  }

  if (!access_token) {
    try {
      const res = await api
        .post('auth/refresh', {
          headers: {
            'Refresh-Token-X': refresh_token.value,
          },
        })
        .json<TToken>();
      console.log(res);

      request.cookies.delete('REFRESH_TOKEN');

      const response = NextResponse.next();
      response.cookies.set('ACCESS_TOKEN', res.accessToken, {
        maxAge: res.accessTokenExpiration,
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
      });
      response.cookies.set('REFRESH_TOKEN', res.refreshToken, {
        maxAge: res.refreshTokenExpiration,
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/dashboard'],
};
