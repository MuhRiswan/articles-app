export type ResponseStrict<T> = {
  data: T;
  meta: {
    version: string;
  };
};

export type Response<T> = {
  data: T;
  meta?: ResponseMeta;
  code: number;
  message: string;
  version: string;
};

export type ResponseMeta = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
  pagination?: Pagination; // tambahkan properti pagination di sini
};

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};
