export const COLLAPSIBLE_COLLAPSED_DURATION = 500; // In ms
export const DEFAULT_STATUS_CODE_UNKNOWN_ERROR = 500;
export const DEFAULT_STATUS_CODE_SUCCESS = 200;
export const DEFAULT_STATUS_CODE_CREATED = 201;
export const DEFAULT_STATUS_CODE_NO_CONTENT = 204;
export const DEFAULT_STATUS_CODE_APPROVE_REJECT = 202;
export const DEFAULT_STATUS_CODE_EXCEPTION = 417;
export const DEFAULT_STATUS_CODE_BAD_REQUEST = 400;
export const DEFAULT_STATUS_CODE_PERMISSION = 403;


export const isImageUrl = (url: string) =>  /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url);

export const isPdfUrl = (url: string) => /\.(pdf)$/.test(url);