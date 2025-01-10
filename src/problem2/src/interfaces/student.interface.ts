import {
  HEALTH_ANSWER,
  HEALTH_ANSWER_TYPE,
} from "src/enums/healthQuestionnaire.enum";
import { GENDER_VALUE } from "src/enums/student.enum";
import { Prettify } from "src/helpers/types.helper";
import { IUser } from "./user.interface";

export type IStudentEmergencyContact = {
  _id: string;
  contactName: string;
  contactSurname: string;
  phoneNumber: string;
  relationship: string;
};

export type IStudentHealthQuestionnaires = {
  _id: string;
  answer: HEALTH_ANSWER;
  questionInfo: {
    _id: string;
    question: string;
    answerType: HEALTH_ANSWER_TYPE;
  };
};

export type IStudent = Prettify<
  Pick<
    IUser,
    | "_id"
    | "firstName"
    | "aliasName"
    | "lastName"
    | "memberId"
    | "locationId"
    | "avatarUrl"
    | "phoneNumber"
    | "email"
    | "timezone"
    | "createdAt"
    | "updatedAt"
  > & {
    dob: string | number;
    status: string;
    gender: GENDER_VALUE;
    emergencyContacts: Array<IStudentEmergencyContact>;
    healthQuestionnaires?: Array<IStudentHealthQuestionnaires>;
  }
>;
