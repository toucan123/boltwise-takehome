export interface InvalidDataErrorParams {
  message?: string;
  info?: unknown;
  data?: unknown;
}

export class InvalidDataError extends Error {
  info?: unknown;
  data?: unknown;

  constructor(params: InvalidDataErrorParams) {
    super(params.message);
    this.info = params.info;
    this.data = params.data;
  }
}