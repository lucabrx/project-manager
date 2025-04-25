import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { authApi } from '~/lib/api';
import { TTaskResponse } from '~/lib/types';
import { useSession } from '~/store/session.store';
import { useWorkspace } from '~/store/workspace.store';

async function fetchTasks(
  workspaceId: number,
  projectId: number,
  authToken: string,
  page: number,
) {
  const api = authApi(authToken);

  const response = await api(
    `task/workspace/${workspaceId}/project/${projectId}?page=${page}&size=20&order=dsc&sort=createdAt`,
  ).json<TTaskResponse>();

  return response;
}

export function useTasks() {
  const { authToken } = useSession();
  const { selectedWorkspace } = useWorkspace();
  const searchParams = useSearchParams().get('project');

  return useInfiniteQuery({
    queryKey: ['issues', selectedWorkspace?.id, searchParams],
    queryFn: ({ pageParam = 0 }) =>
      fetchTasks(selectedWorkspace?.id!, +searchParams!, authToken, pageParam),
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      return nextPage < lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 0,
  });
}
