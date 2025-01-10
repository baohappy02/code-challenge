import {
  HEALTH_ANSWER_TYPE,
  HEALTH_EXPECTED_ANSWER,
  HEALTH_SECTION_LABEL,
} from "src/enums/healthQuestionnaire.enum";

export interface IHealthQuestionnaire {
  _id: string;
  brandId: string;
  locationId?: string;
  question: string;
  isActive: boolean;
  mandatory: boolean;
  expectedAnswer: HEALTH_EXPECTED_ANSWER;
  answerType: HEALTH_ANSWER_TYPE;
  sectionLabel: HEALTH_SECTION_LABEL;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface IHealthQuestionnaireResponseWithAnswerType {
  answer?: string;
}
