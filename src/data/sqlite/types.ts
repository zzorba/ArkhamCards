export interface QueryParams {
  [key: string]: number | string | string[] | number[];
}

export interface QueryClause {
  q: string;
  params?: QueryParams;
}

export interface QuerySort {
  s: string;
  direction: 'ASC' | 'DESC';
}
