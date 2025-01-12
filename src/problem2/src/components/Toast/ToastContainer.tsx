import { IToast } from "common/interfaces/toast.interface";
import Toast from ".";
import "./styles.scss";

interface IToastContainerProps {
  toasts: Array<IToast>;
}

const ToastContainer = (props: IToastContainerProps) => {
  const { toasts } = props;
  return (
    <div className="c__toasts-container">
      {toasts.map((toast: IToast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
