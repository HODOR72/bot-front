export interface PostFileParams extends FormData {}

export interface PostFileResponse {
    id: string;
    user_filename: string;
}

export enum ImageResize {
    RESIZE_WIDTH_TOP = 1,
    RESIZE_WIDTH_CENTER = 2,
    RESIZE_WIDTH_BOTTOM = 3,
    RESIZE_HEIGHT_LEFT = 4,
    RESIZE_HEIGHT_CENTER = 5,
    RESIZE_HEIGHT_RIGHT = 6,
    RESIZE_BOTH_CENTER = 7,
}
