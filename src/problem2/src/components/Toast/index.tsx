import { useCallback, useEffect, useRef, useState } from "react";

import { HiXMark } from "react-icons/hi2";
import { useToast } from "src/context/ToastContext";
import { IToast } from "src/interfaces/toast.interface";
import { TOAST_TYPE } from "src/types/toast.type";

const DEFAULT_DURATION = 10000;

const toastTypes: Record<
  TOAST_TYPE,
  {
    icon: string;
    iconClass: string;
    progressBarClass: string;
  }
> = {
  success: {
    icon: "/icons/check.svg",
    iconClass: "success",
    progressBarClass: "success",
  },
  warning: {
    icon: "/icons/info.svg",
    iconClass: "warning",
    progressBarClass: "warning",
  },
  error: {
    icon: "/icons/close.svg",
    iconClass: "error",
    progressBarClass: "error",
  },
  info: {
    icon: "/icons/info.svg",
    iconClass: "info",
    progressBarClass: "info",
  },
};

const Toast = (props: IToast) => {
  const { id, message, type, options } = props;

  const timerID = useRef<string | number | NodeJS.Timeout | undefined>(
    undefined,
  ); // create a Reference
  const progressRef = useRef<any>(null);

  const { icon, iconClass, progressBarClass } = toastTypes[type];

  const toast = useToast(); // call useToast

  // rest of the code
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const handleDismiss = useCallback(() => {
    setIsDismissed(true);
    setTimeout(() => {
      toast.remove(props);
    }, 500);
    // eslint-disable-next-line
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(timerID.current);
    progressRef.current.style.animationPlayState = "paused";
  };

  const handleMouseLeave = () => {
    const remainingTime =
      (progressRef.current.offsetWidth /
        progressRef.current.parentElement.offsetWidth) *
      (options?.duration || DEFAULT_DURATION);

    progressRef.current.style.animationPlayState = "running";

    timerID.current = setTimeout(() => {
      handleDismiss();
    }, remainingTime);
  };

  useEffect(() => {
    timerID.current = setTimeout(() => {
      handleDismiss();
    }, options?.duration || DEFAULT_DURATION);

    return () => {
      clearTimeout(timerID.current);
    };
  }, [handleDismiss, options?.duration]);

  return (
    <div
      className={`c__toast ${isDismissed ? "c__toast-dismissed" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      id={id}
    >
      <div className="c__toast-title">
        <div className={`c__toast-title-icon c__toast-title-icon-${iconClass}`}>
          <div>
            <img src={icon} alt={iconClass} />
          </div>
        </div>
        <p className="c__toast-title-message">{message}</p>
      </div>
      <div onClick={handleDismiss} className="c__toast-dismissedButton">
        <HiXMark />
      </div>
      {/* Toast Progress Bar */}
      <div className="c__toast-progress">
        <div
          style={{
            animationDuration: `${options?.duration || DEFAULT_DURATION}ms`,
          }}
          ref={progressRef}
          className={`c__toast-progress-bar c__toast-progress-bar-${progressBarClass}`}
        ></div>
      </div>
    </div>
  );
};

export default Toast;
