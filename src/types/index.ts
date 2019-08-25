export interface ResourceInterface {
  src: string;
  id: number | string;
  status?: string;
  resource?: HTMLImageElement;
}

export interface UnitsInterface {
  [_id: string]: {
    _id: string;
    [propName: string]: any;
  }
}
