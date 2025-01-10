import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const secondsToHms = (d: number) => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + (h === 1 ? "" : "") : "";
  var mDisplay = m > 0 ? m + (m === 1 ? "" : "") : "";
  var sDisplay = s > 0 ? s + (s === 1 ? "" : "") : "";
  if (hDisplay !== "") {
    return (
      (hDisplay.length > 1 ? hDisplay : "0" + hDisplay) +
      ":" +
      (mDisplay.length > 1 ? mDisplay : "0" + mDisplay) +
      ":" +
      (sDisplay.length > 1 ? sDisplay : "0" + sDisplay)
    );
  } else if (mDisplay !== "") {
    return (
      (mDisplay.length > 1 ? mDisplay : "0" + mDisplay) +
      ":" +
      (sDisplay.length > 1 ? sDisplay : "0" + sDisplay)
    );
  } else if (sDisplay !== "") {
    return "00:" + (sDisplay.length > 1 ? sDisplay : "0" + sDisplay);
  }
  return "00:00";
};

export function convertFloatToTime(input: number): string {
  const hours = Math.floor(input);
  const minutes = Math.round((input - hours) * 60);
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}
export function convertToUnixTime(input: string): number {
  return dayjs(input).valueOf();
}
export function calculateEndTime(
  startTime: Dayjs,
  duration: number | string,
): string {
  const resultTime = startTime.add(Number(duration), "minutes").format("HH:mm");
  return resultTime;
}

export const getCurrentUserTimeZone = () => {
  return dayjs.tz.guess();
};

export function getTimezoneOffset(timezoneString: string) {
  if (!timezoneString || timezoneString.length < 6) {
    return 0;
  }

  const offset = Number(timezoneString.slice(1, 3));

  if (timezoneString[0] === "-") {
    return -offset;
  } else {
    return offset;
  }
}

export const getDaysArray = (start: Date, end: Date) => {
  const daysArray: Date[] = [];
  let currentDate = new Date(start);
  end.setHours(23);
  end.setMinutes(59);
  end.setSeconds(59);

  while (currentDate <= new Date(end)) {
    daysArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return daysArray;
};

export const getNearestFromNowByDateNTime = (listDates: Date[]) => {
  const listDatesWithTimeStamp = listDates.map((d) => d.getTime());
  return new Date(Math.max(...listDatesWithTimeStamp));
};

export const getFarthestFromNowByDateNTime = (listDates: Date[]) => {
  const listDatesWithTimeStamp = listDates.map((d) => d.getTime());
  return new Date(Math.min(...listDatesWithTimeStamp));
};
