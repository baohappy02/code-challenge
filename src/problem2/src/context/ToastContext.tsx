import { createContext, useContext, useReducer } from "react";
import {
  ADD_TOAST,
  REMOVE_TOAST,
  toastReducer,
} from "src/components/Toast/reducer";
import ToastContainer from "src/components/Toast/ToastContainer";
import { ERROR_MESSAGE_FORBIDDEN_RESOURCE } from "src/constants";
import { IToast, IToastOptions } from "src/interfaces/toast.interface";
import { TOAST_TYPE } from "src/types/toast.type";
import { v4 as uuidv4 } from "uuid";

export interface ToastContextType {
  success: (message: string, options?: IToastOptions) => void;
  warning: (message: string, options?: IToastOptions) => void;
  error: (message: string, options?: IToastOptions) => void;
  info: (message: string, options?: IToastOptions) => void;
  remove: (toast: IToast) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = (): ToastContextType => {
  const toastContext = useContext(ToastContext);

  if (!toastContext) {
    throw new Error("useToast must be used within an any");
  }

  return toastContext;
};

const initialState: { toasts: Array<IToast> } = {
  toasts: [],
};

export const ToastProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(toastReducer, initialState);

  const handleAddToast = (
    type: TOAST_TYPE,
    message: string,
    options?: IToastOptions,
  ) => {
    const id = uuidv4();
    dispatch({
      type: ADD_TOAST,
      payload: { id, message, type, options },
    });
  };

  const remove = (toast: IToast) => {
    dispatch({ type: REMOVE_TOAST, payload: toast });
  };

  const success = (message: string, options?: IToastOptions) => {
    handleAddToast("success", message, options);
  };

  const warning = (message: string, options?: IToastOptions) => {
    handleAddToast("warning", message, options);
  };

  const error = (message: string, options?: IToastOptions) => {
    if (message === ERROR_MESSAGE_FORBIDDEN_RESOURCE) return;
    handleAddToast("error", message, options);
  };

  const info = (message: string, options?: IToastOptions) => {
    handleAddToast("info", message, options);
  };

  const toastContextValue: ToastContextType = {
    success,
    warning,
    error,
    remove,
    info,
  };

  return (
    <ToastContext.Provider value={toastContextValue}>
      <ToastContainer toasts={state.toasts} />
      {children}
    </ToastContext.Provider>
  );
};
