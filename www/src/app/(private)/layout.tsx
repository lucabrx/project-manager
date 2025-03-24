import { cookies } from 'next/headers';
import { SessionProvider } from '~/components/session-provider';
import { authApi } from '~/lib/api';
import { TUser, TWorkspaceResponse } from '~/lib/types';

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('ACCESS_TOKEN');
  const api = authApi(authToken?.value!);
  const [user, workspaces] = await Promise.all([
    api.get('auth/session').json<TUser>(),
    api.get('workspace').json<TWorkspaceResponse[]>(),
  ]);

  return (
    <SessionProvider
      user={user}
      workspaces={workspaces}
      authToken={authToken?.value!}
    >
      {children}
    </SessionProvider>
  );
}
