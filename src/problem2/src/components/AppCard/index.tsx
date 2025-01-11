import "./index.scss";

import {
  IAppCardContentItemProps,
  IAppCardContentProps,
  IAppCardHeaderProps,
  IAppCardProps,
} from "./interfaces";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const AppCard = (props: IAppCardProps) => {
  return (
    <div
      {...props}
      className={`c__card ${props?.className ? props.className : " "}`}
    >
      {props.children}
    </div>
  );
};
export default AppCard;

// ==============================

const AppCardHeader = (props: IAppCardHeaderProps) => {
  return (
    <div
      {...props}
      className={`c__card-header ${props?.className ? props.className : " "}`}
    >
      <p className="c__card-header-title">{props.title}</p>
      {!!props.suffix && (
        <div className="c__card-header-suffix">{props.suffix}</div>
      )}
    </div>
  );
};
const AppCardContent = (props: IAppCardContentProps) => {
  return (
    <div
      {...props}
      className={`c__card-content ${props?.className ? props.className : " "}`}
    >
      {props.children}
    </div>
  );
};
const AppCardContentItem = (props: IAppCardContentItemProps) => {
  const {
    subtitle = "",
    title = "",
    isColor = false,
    children,
    isHtml = false,
  } = props;

  const { t } = useTranslation();

  const __unCapitalizeEmail = useMemo(() => {
    return [
      t("emailAddress"),
      t("email"),
      `${t("emailAddress")}*`,
      `${t("email")}*`,
    ].includes(subtitle);
  }, [subtitle, t]);

  return (
    <div
      className={`c__card-content-item ${
        props?.className ? props.className : " "
      }`}
    >
      <p className="c__card-content-item-sub">{subtitle}</p>
      {isColor ? (
        <div style={{ backgroundColor: title }} className="block-color" />
      ) : isHtml ? (
        <div
          className={`c__card-content-item-title ${
            __unCapitalizeEmail ? "normalText" : ""
          }`}
        >
          {children}
        </div>
      ) : (
        <p
          className={`c__card-content-item-title ${
            __unCapitalizeEmail ? "normalText" : ""
          }`}
        >
          {title ? title : children}
        </p>
      )}
    </div>
  );
};

export { AppCardHeader, AppCardContent, AppCardContentItem };
