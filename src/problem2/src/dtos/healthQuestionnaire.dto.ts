import {
  IHealthQuestionnaire,
  IHealthQuestionnaireResponseWithAnswerType,
} from "src/interfaces/healthQuestionnaire.interface";

export type CreateHealthQuestionnaireDto = Pick<
  IHealthQuestionnaire,
  | "question"
  | "answerType"
  | "sectionLabel"
  | "isActive"
  | "mandatory"
  | "expectedAnswer"
  | "locationId"
>;

export type UpdateHealthQuestionnaireDto = Pick<
  IHealthQuestionnaire,
  | "question"
  | "answerType"
  | "sectionLabel"
  | "isActive"
  | "mandatory"
  | "expectedAnswer"
>;

export type ListHealthQuestionnaireDto = Pick<
  IHealthQuestionnaire,
  | "_id"
  | "question"
  | "answerType"
  | "sectionLabel"
  | "isActive"
  | "mandatory"
  | "expectedAnswer"
  | "locationId"
  | "createdAt"
> &
  IHealthQuestionnaireResponseWithAnswerType;
