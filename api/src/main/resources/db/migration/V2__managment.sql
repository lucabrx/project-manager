CREATE TABLE workspaces (
    id BIGSERIAL PRIMARY KEY,
    name text NOT NULL,
    description text,
    logo text,
    owner_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workspace_members (
    id BIGSERIAL PRIMARY KEY,
    workspace_id bigint NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    role text NOT NULL DEFAULT 'member',
    status text NOT NULL DEFAULT 'pending',
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    workspace_id bigint NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
    owner_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    name text NOT NULL,
    description text,
    icon text,
    color text,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    project_id bigint NOT NULL REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
    assignee_user_id bigint REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    position integer DEFAULT 0,
    number integer DEFAULT 1,
    title text NOT NULL,
    description text,
    status text NOT NULL DEFAULT 'todo',
    priority text DEFAULT 'low',
    due_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    task_id bigint NOT NULL REFERENCES tasks(id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    type text NOT NULL,
    content text,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id bigint NOT NULL REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    type text NOT NULL,
    content text,
    read boolean NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
