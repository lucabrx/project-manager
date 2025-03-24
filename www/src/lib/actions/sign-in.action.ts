'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignInForm } from '../validators/auth.validator';
import { TLoginResponse } from '../types';
import { api } from '../api';

export async function signIn(data: SignInForm) {
  const res = await api
    .post('auth/login', {
      json: data,
    })
    .json<TLoginResponse>();

  console.log(res);

  const cookieStore = await cookies();
  cookieStore.set('ACCESS_TOKEN', res.token.accessToken, {
    maxAge: res.token.accessTokenExpiration,
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
  cookieStore.set('REFRESH_TOKEN', res.token.refreshToken, {
    maxAge: res.token.refreshTokenExpiration,
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });

  redirect('/dashboard');
}
