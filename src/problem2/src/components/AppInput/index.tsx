import "./index.scss";

import React, { InputHTMLAttributes, useMemo } from "react";
import { GoXCircleFill } from "react-icons/go";

export type InputSize = "large" | "small";

interface IAppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  inputSize?: InputSize;
  noFloatingLabel?: boolean;
  onClearSearch?: () => void;
  message?: {
    type: "error" | "success" | "caption";
    text: string;
  };
  showDescription?: boolean;
  description?: string;
}

const AppInput = React.forwardRef<HTMLInputElement, IAppInputProps>(
  (
    {
      label,
      inputSize = "large",
      noFloatingLabel = false,
      onClearSearch,
      message,
      showDescription = false,
      description = "",
      ...props
    },
    ref,
  ) => {
    const __renderClearSearch = useMemo(() => {
      if (props?.value === "" || !onClearSearch) return null;
      return (
        <div className="c__input-clear" onClick={onClearSearch}>
          <GoXCircleFill />
        </div>
      );
    }, [onClearSearch, props?.value]);

    const __renderMessage = useMemo(() => {
      if (!message) return null;
      return (
        <p className={`c__input-message c__input-message-${message.type}`}>
          {message.text}
        </p>
      );
    }, [message]);

    return (
      <div className={`c__input`} style={props.style}>
        <div style={{ position: "relative" }}>
          <input
            {...props}
            className={`c__input-field c__input-field-${inputSize} ${
              !!onClearSearch ? "c__input-field-append-right" : ""
            } ${message?.text ? `c__input-border-${message?.type}` : ""}${
              props.disabled ? "c__input-field-disabled" : ""
            }`}
            id={props?.id || props?.name}
            ref={ref}
            placeholder={label}
            autoComplete="off"
          />

          {__renderClearSearch}
          <label
            className={`c__input-label ${
              noFloatingLabel ? "c__input-label-noFloating" : " "
            }`}
            htmlFor={props?.id || props?.name}
          >
            {label}
          </label>
        </div>
        {showDescription && (
          <p className={`c__input-message c__input-message-description`}>
            {description}
          </p>
        )}
        {__renderMessage}
      </div>
    );
  },
);

export default AppInput;
