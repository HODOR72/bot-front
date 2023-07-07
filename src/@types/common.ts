export type RequestError = {
  message: string;
}

export type CommonState = {
  isLoading: boolean;
  error?: RequestError;
}

export type Pagination = {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  links?: [];
}

export type ListParams = {
  page?: number;
  order?: 'asc' | 'desc';
  order_by?: string;
}
