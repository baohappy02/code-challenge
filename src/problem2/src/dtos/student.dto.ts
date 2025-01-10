import { Prettify } from "src/helpers/types.helper";
import { IStudent } from "src/interfaces/student.interface";

export type IStudentHealthQuestionnaires = {
  questionId: string;
  answer: string;
};

export type IStudentEmergencyContact = {
  contactName: string;
  contactSurname: string;
  phoneNumber: string;
  relationship: string;
};

export type FormCreateStudentDto = Prettify<
  Required<
    Pick<
      IStudent,
      "firstName" | "lastName" | "aliasName" | "gender" | "locationId"
    > & {
      dob: string | number;
      emergencyContacts: IStudentEmergencyContact[];
    }
  >
>;

export type CreateStudentDto = Prettify<
  Required<
    Pick<
      IStudent,
      "firstName" | "lastName" | "aliasName" | "gender" | "timezone"
    > & {
      dob: number;
      emergencyContacts: Pick<
        IStudentEmergencyContact,
        "contactName" | "contactSurname" | "phoneNumber" | "relationship"
      >[];
    }
  > & {
    responsiblePersonId?: string;
    questionnaireAnswers?: IStudentHealthQuestionnaires[];
    enrolledAsStudent?: boolean;
    avatarUrl?: string | number;
  }
>;
