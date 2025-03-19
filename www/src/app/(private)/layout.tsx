import { cookies } from 'next/headers';
import UserProvider from '~/components/session-provider';
import { authApi } from '~/lib/api';
import { TUser } from '~/lib/types';

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const api = authApi(cookieStore);
  const [user, workspaces] = await Promise.all([
    api.get('auth/session').json<TUser>(),
    api.get('workspace').json(),
  ]);

  return (
    <UserProvider user={user} workspaces={workspaces}>
      {children}
    </UserProvider>
  );
}
