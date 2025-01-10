import React, { useMemo, useRef, forwardRef } from "react";
import PhoneInput from "react-phone-number-input";
import { v4 as uuidv4 } from "uuid";
import "react-phone-number-input/style.css";
import "./index.scss";

type Size = "large" | "small";

export interface RefHandle {}

interface IAppPhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  size?: Size;
  noFloatingLabel?: boolean;
  suffix?: React.ReactNode;
  message?: {
    type: "error" | "success" | "caption";
    text: string;
  };
  disabled?: boolean;
  showDescription?: boolean;
  description?: string;
}

const AppPhoneNumberInput = forwardRef<RefHandle, IAppPhoneNumberInputProps>(
  (props, _) => {
    const {
      value,
      onChange,
      label,
      size = "large",
      noFloatingLabel = false,
      suffix,
      message,
      disabled = false,
      showDescription = false,
      description = "",
    } = props;

    const id = uuidv4();
    const phoneNumberRef = useRef<any>(null);

    const [focused, setFocused] = React.useState(false);
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    const __renderMessage = useMemo(() => {
      if (!message) return null;
      return (
        <p
          className={`c__phoneNumberInput-message c__phoneNumberInput-message-${message.type}`}
        >
          {message.text}
        </p>
      );
    }, [message]);

    return (
      <div className="c__phoneNumberInput-wrapper">
        <div
          className={`c__phoneNumberInput c__phoneNumberInput-${size} ${
            !!suffix ? "c__phoneNumberInput-appendRight" : " "
          } ${
            message?.text ? `c__phoneNumberInput-border-${message?.type}` : ""
          }`}
        >
          <PhoneInput
            international
            countryCallingCodeEditable={false}
            id={id}
            ref={phoneNumberRef}
            onFocus={onFocus}
            onBlur={onBlur}
            value={value}
            onChange={(value) => onChange(value || "")}
            defaultCountry="AU"
            disabled={disabled}
            limitMaxLength
          />

          <label
            className={`c__phoneNumberInput-label ${
              noFloatingLabel ? "c__phoneNumberInput-label-noFloating" : " "
            } ${focused || !!value ? "c__phoneNumberInput-label-active" : " "}`}
            htmlFor={id}
          >
            {label}
          </label>

          {suffix && <div className="c__phoneNumberInput-suffix">{suffix}</div>}
        </div>
        {showDescription && (
          <p
            className={`c__phoneNumberInput-message c__phoneNumberInput-message-description`}
          >
            {description}
          </p>
        )}
        {__renderMessage}
      </div>
    );
  },
);

export default AppPhoneNumberInput;
