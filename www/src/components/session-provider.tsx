'use client';

import { useEffect, useState } from 'react';
import { TUser } from '~/lib/types';
import { useSession } from '~/store/session.store';
import { useWorkspace } from '~/store/workspace.store';
import { Modal } from './ui/modal';

export default function UserProvider({
  user,
  workspaces,
  children,
}: {
  user: TUser;
  workspaces: string[];
  children: React.ReactNode;
}) {
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);

  useEffect(() => {
    if (!workspaces.length) setShowCreateWorkspace(true);
    useSession.setState({ user });
    useWorkspace.setState({ workspaces });
  }, [user, workspaces]);

  return (
    <>
      {showCreateWorkspace && (
        <Modal onClose={() => setShowCreateWorkspace(false)}>hello world</Modal>
      )}
      {children}
    </>
  );
}
