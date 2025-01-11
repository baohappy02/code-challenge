import {
  useState,
  useEffect,
  InputHTMLAttributes,
  useCallback,
  memo,
} from "react";

import AppSelect from "../../components/AppSelect";

import { GENDER_TYPE_OPTIONS } from "../../constants";
import { useTranslation } from "react-i18next";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  defaultValue?: string;
  searchable?: boolean;
  message?: {
    type: "error" | "success" | "caption";
    text: string;
  };
  onChangeGender?: (val: string) => void;
}

const AppGenderInput = ({
  label = " ",
  defaultValue = "",
  searchable = true,
  message,
  onChangeGender,
  ...props
}: Props) => {
  const { t } = useTranslation();

  const [gender, setGender] = useState<string>("");

  const handleEmitChange = useCallback((location: string) => {
    if (onChangeGender) onChangeGender(location);

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setGender(defaultValue);
  }, [defaultValue, handleEmitChange]);

  return (
    <>
      <AppSelect
        {...props}
        label={label}
        searchable={searchable}
        options={GENDER_TYPE_OPTIONS.map((option) => ({
          label: t(option.label),
          value: option.value,
        }))}
        value={gender}
        message={message}
        onChange={(val) => {
          setGender(val.target.value);

          handleEmitChange(val.target.value);
        }}
      />
    </>
  );
};

export default memo(AppGenderInput);
