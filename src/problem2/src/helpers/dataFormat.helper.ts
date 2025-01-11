import dayjs, { Dayjs } from "dayjs";
import { formatPhoneNumberIntl } from "react-phone-number-input";

export const formatData = (data: any) => {
  if (data === 0) return data;
  if (!data) return "--";
  return data;
};

export const formatDate = (data: any, option: "slash" | "dash" = "dash") => {
  if (!data) return "--";
  if (option === "dash") {
    return dayjs(data).format("DD-MM-YYYY");
  } else {
    return dayjs(data).format("DD/MM/YYYY");
  }
};

export const formatTime = (data: any) => {
  if (!data) return "--";
  return dayjs(data).format("HH:mm");
};

export const formatSecretPhoneNumber = (
  phoneNumber: string | undefined,
): string => {
  if (!phoneNumber) return "--";
  return phoneNumber.slice(0, 3) + "**" + phoneNumber.slice(-2);
};

export const formatUnderscoreString = (slug: string) => {
  const newWords = slug
    .split("_")
    .map((word, i) => {
      if (i === 0) {
        return word.charAt(0).toUpperCase() + word.substr(1);
      }
      return word;
    })
    .join(" ");

  return newWords;
};

export const stringifyNumber = (number: number) => {
  if (number < 20) return special[number];
  if (number % 10 === 0) return deca[Math.floor(number / 10) - 2] + "ieth";
  return deca[Math.floor(number / 10) - 2] + "y-" + special[number % 10];
};

export const formatTimezone = (data: any) => {
  if (data === 0) return data;
  if (!data) return "--";
  return data.split("_").join(" ");
};

const special = [
  "zeroth",
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth",
  "eleventh",
  "twelfth",
  "thirteenth",
  "fourteenth",
  "fifteenth",
  "sixteenth",
  "seventeenth",
  "eighteenth",
  "nineteenth",
];
const deca = [
  "twent",
  "thirt",
  "fort",
  "fift",
  "sixt",
  "sevent",
  "eight",
  "ninet",
];

export const formatNumberNoIntl = (phoneNumberIntl: string) => {
  return formatPhoneNumberIntl(phoneNumberIntl)
    .split(" ")
    .splice(1, formatPhoneNumberIntl(phoneNumberIntl).split(" ")?.length - 1)
    .join("");
};

export const roundByTwo = (num: number) => {
  return Number((Math.round(num * 100) / 100).toFixed(2));
};

export const formatMoneySign = (data: string | number) => {
  if (data === 0) return "$" + roundByTwo(data);
  if (!data) return "--";
  if (typeof data === "string") return "$" + roundByTwo(Number(data));
  if (roundByTwo(Number(data)) < 0) {
    return "-$" + roundByTwo(Math.abs(Number(data)));
  }
  return "$" + roundByTwo(data);
};

export const formatMoneyText = (data: number, text = "makeup") => {
  if (data === 0) return data + ` ${text}${data > 1 ? "s" : ""}`;
  if (!data) return "--";
  return data + ` ${text}${data > 1 ? "s" : ""}`;
};

export const getOrdinalIndicator = (day: number) => {
  if (day >= 11 && day <= 13) {
    return "th";
  }

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const getDoTypeDay = (day: Dayjs) => {
  return `${dayjs(day)?.date()}${getOrdinalIndicator(dayjs(day)?.date())}`;
};

export const formatPercentNumber = (data?: number) => {
  if (data === 0 || data) return `${data}%`;
  return "--";
};

export const convertToOrdinal = (number: number) => {
  if (number < 1 || isNaN(number)) {
    return "Invalid input. Please enter a valid number.";
  }

  const lastDigit = number % 10;
  const secondLastDigit = Math.floor((number % 100) / 10);

  if (secondLastDigit === 1) {
    return number + "th";
  } else {
    switch (lastDigit) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
      default:
        return number + "th";
    }
  }
};

export const formatNumberByXDigits = (n: number, digit?: number) =>
  ("0" + n).slice(-(digit ?? 2));
