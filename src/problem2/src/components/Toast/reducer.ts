import { IToast } from "common/interfaces/toast.interface";

export const ADD_TOAST = "ADD_TOAST";
export const REMOVE_TOAST = "REMOVE_TOAST";

export const toastReducer = (
  state: { toasts: Array<IToast> },
  action: { type: string; payload: IToast },
) => {
  switch (action.type) {
    case ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    case REMOVE_TOAST:
      const updatedToasts = state.toasts.filter(
        (toast) => toast.id !== action.payload.id,
      );
      return {
        ...state,
        toasts: updatedToasts,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
