import { useQuery } from '@tanstack/react-query';
import { authApi } from '~/lib/api';
import { TProject } from '~/lib/types';
import { useSession } from '~/store/session.store';
import { useWorkspace } from '~/store/workspace.store';

function fetchProjects(workspaceId: number, authToken: string) {
  const api = authApi(authToken);
  return api.get(`project/workspace/${workspaceId}`).json<TProject[]>();
}

export function useProjects() {
  const { authToken } = useSession();
  const { selectedWorkspace } = useWorkspace();

  return useQuery({
    queryKey: ['projects', selectedWorkspace?.id],
    queryFn: () =>
      selectedWorkspace && fetchProjects(selectedWorkspace.id, authToken),
  });
}
