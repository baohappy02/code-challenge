import "./index.scss";

import React, { useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { DateView } from "@mui/x-date-pickers";

type Size = "large" | "small" | "x-small";

interface IAppDatePickerProps extends DatePickerProps<any> {
  value: Dayjs | null;
  onChange?: (value: Dayjs | null) => void;
  label: string;
  size?: Size;
  noFloatingLabel?: boolean;
  message?: {
    type: "error" | "success" | "caption";
    text: string;
  };
  disabled?: boolean;
  views?: readonly DateView[] | undefined;
  formats?: string | undefined;
  showDescription?: boolean;
  description?: string;
}
const AppDatePicker = React.forwardRef(
  (props: IAppDatePickerProps, ref: React.Ref<HTMLDivElement>) => {
    const {
      value,
      onChange,
      label,
      size = "large",
      noFloatingLabel = false,
      message,
      disabled = false,
      views = ["year", "month", "day"],
      formats = "DD/MM/YYYY",
      showDescription = false,
      description = "",
    } = props;

    const __renderMessage = useMemo(() => {
      if (!message) return null;
      return (
        <p
          className={`c__datePicker-message c__datePicker-message-${message.type}`}
        >
          {message.text}
        </p>
      );
    }, [message]);

    return (
      <div className={`c__datePicker_wrapper ${disabled ? "disabled" : ""}`}>
        <div>
          <div
            className={`c__datePicker_wrapper-${size} ${
              noFloatingLabel ? "c__datePicker_wrapper-noFloatingLabel" : " "
            } ${
              message?.text
                ? `c__datePicker_wrapper-border-${message?.type}`
                : ""
            }`}
            ref={ref}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  {...props}
                  views={views}
                  label={label}
                  value={value}
                  minDate={dayjs().subtract(100, "year")}
                  onChange={onChange}
                  format={formats}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
        {showDescription && (
          <p
            className={`c__datePicker-message c__datePicker-message-description`}
          >
            {description}
          </p>
        )}
        {__renderMessage}
      </div>
    );
  },
);

export default AppDatePicker;
