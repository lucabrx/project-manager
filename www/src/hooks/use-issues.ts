import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { authApi } from '~/lib/api';
import { TTaskResponse } from '~/lib/types';
import { useSession } from '~/store/session.store';
import { useWorkspace } from '~/store/workspace.store';

async function fetchIssues(
  workspaceId: number,
  projectId: number,
  authToken: string,
) {
  const api = authApi(authToken);

  const response = await api(
    `task/workspace/${workspaceId}/project/${projectId}`,
  ).json<TTaskResponse>();

  return response;
}

export function useIssues() {
  const { authToken } = useSession();
  const { selectedWorkspace } = useWorkspace();
  const searchParams = useSearchParams().get('project');

  return useQuery({
    queryKey: ['issues', selectedWorkspace?.id, searchParams],
    queryFn: () =>
      fetchIssues(selectedWorkspace?.id!, +searchParams!, authToken),
  });
}
