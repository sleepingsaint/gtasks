export interface TokenResponse {
    access_token?: string;
    expires_in?: number;
    token_type?: string;
    scope?: string;
    refresh_token?: string;
    error?: string;
    error_description?: string;
}

export interface TaskListType {
    kind: string;
    id: string;
    etag: string;
    title: string;
    updated: string;
    selfLink: string;
}

export interface TaskType {
    kind: string;
    id: string;
    etag: string;
    title: string;
    updated: string;
    selfLink: string;
    position: string;
    notes: string;
    status: string;
    due: string;
    completed?: string;
    deleted: boolean;
    hidden: boolean;
    parent?: string;
    links: [
        {
            type: string;
            description: string;
            link: string;
        }
    ]
}

export interface UserProfile {
    name: string;
    picture: string;
}

export interface TasksAPIResponse<T> {
    kind: string;
    etag: string;
    nextPageToken?: string;
    items: Array<T>;
}
