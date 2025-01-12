import { GENDER } from "src/enums/user.enum";
import { IOption } from "src/interfaces";

export const ERROR_MESSAGE_FORBIDDEN_RESOURCE = "Forbidden resource";

export const GENDER_TYPE_OPTIONS: Array<IOption> = [
  {
    label: GENDER.MALE,
    value: GENDER.MALE,
  },
  {
    label: GENDER.FEMALE,
    value: GENDER.FEMALE,
  },
  {
    label: GENDER.OTHER,
    value: GENDER.OTHER,
  },
];
