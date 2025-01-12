import { TOAST_POSITION, TOAST_TYPE } from "../types/toast.type";

export interface IToast {
  id: string;
  message: string;
  type: TOAST_TYPE;
  options?: IToastOptions;
}

export interface IToastOptions {
  duration?: number;
  position?: TOAST_POSITION;
}
