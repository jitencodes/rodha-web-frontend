/** Raw state row from GET api/website/states/dropdown */
export interface StateApi {
  id: number;
  name: string;
  code: string;
}

export interface StateDropdownDataApi {
  items?: StateApi[];
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/** Nested `state` on auth user / me */
export interface AuthStateApi {
  id: number;
  name: string;
  code: string;
}

export interface StateOptionViewModel {
  /** API id — use as `stateId` in mutations */
  stateId: number;
  name: string;
  code: string;
  /** DropdownSelect value (stringified id) */
  value: string;
  /** Display label */
  label: string;
}

export interface StateDropdownViewModel {
  items: StateOptionViewModel[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
