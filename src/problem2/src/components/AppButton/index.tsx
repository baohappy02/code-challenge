import "./index.scss";

import React, { ButtonHTMLAttributes, MouseEventHandler } from "react";
import { BeatLoader } from "react-spinners";

type ButtonVariant = "primary" | "secondary" | "disabled";
type ButtonType = "large" | "small";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  buttonSize?: ButtonType;
  children: React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  style?: React.CSSProperties;
}

const AppButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      buttonSize = "large",
      children,
      onClick,
      isLoading = false,
      style,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        style={style}
        onClick={onClick}
        ref={ref}
        {...props}
        className={`btn btn-${variant} btn-${buttonSize} ${props.className}`}
        disabled={disabled || isLoading}
      >
        {isLoading ? <BeatLoader color={"var(--titleColor)"} /> : children}
      </button>
    );
  },
);

export default AppButton;
