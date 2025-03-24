import ky from 'ky';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export const api = ky.extend({
  prefixUrl: 'http://localhost:9000/v1',
});

export function authApi(token: string) {
  return ky.extend({
    prefixUrl: 'http://localhost:9000/v1',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

type UploadImgType = {
  authToken: string;
  file: File | Blob | null;
};

export async function uploadImage({
  authToken,
  file,
}: UploadImgType): Promise<string | undefined> {
  if (!file) return;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await api
      .post<{ url: string }>('upload', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      })
      .json();
    return res.url;
  } catch (error) {
    //TODO toast
    console.error(error);
  }
}
