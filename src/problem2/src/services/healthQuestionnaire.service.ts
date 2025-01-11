import { IHealthQuestionnaire } from "src/interfaces/healthQuestionnaire.interface";

const result = [
  {
    _id: "68c5bd83-35f7-4d83-aa56-528292bd6db2",
    question: "specialCondition",
    expectedAnswer: "no",
    isActive: true,
    mandatory: true,
    answerType: "number",
    sectionLabel: "health_check",
    locationId: "111bb5fc-e78f-4099-b6c8-3df01d7a9ed2",
    createdAt: "2024-05-22T10:28:43.413Z",
    updatedAt: "2024-06-17T11:11:13.411Z",
    __v: 0,
  },
  {
    _id: "5d25a8d0-3613-4c6c-b76d-bac69d1fa546",
    question: "onMedicine",
    expectedAnswer: "no",
    isActive: true,
    mandatory: true,
    answerType: "number",
    sectionLabel: "health_check",
    locationId: "111bb5fc-e78f-4099-b6c8-3df01d7a9ed2",
    createdAt: "2024-05-22T10:26:53.288Z",
    updatedAt: "2024-05-27T05:24:57.458Z",
    __v: 0,
  },
  {
    _id: "02ba71ca-adcc-4f1e-8c0c-b09436266808",
    question: "hospitalVisitFrequency",
    isActive: true,
    mandatory: true,
    answerType: "string",
    sectionLabel: "health_check",
    locationId: "111bb5fc-e78f-4099-b6c8-3df01d7a9ed2",
    createdAt: "2024-05-22T09:04:36.614Z",
    updatedAt: "2024-05-27T05:25:03.816Z",
    __v: 0,
    expectedAnswer: "",
  },
  {
    _id: "dfadbbc5-66d9-469a-90c1-bfcf411e3755",
    question: "breathingCondition",
    expectedAnswer: "yes",
    isActive: true,
    mandatory: true,
    answerType: "number",
    sectionLabel: "health_check",
    locationId: "111bb5fc-e78f-4099-b6c8-3df01d7a9ed2",
    createdAt: "2023-09-26T14:55:23.030Z",
    updatedAt: "2024-05-27T05:25:13.027Z",
    __v: 0,
  },
  {
    _id: "554287e9-adab-4afc-b6ee-149b5fd7a001",
    question: "medicationNote",
    isActive: false,
    mandatory: false,
    answerType: "string",
    sectionLabel: "health_check",
    locationId: "111bb5fc-e78f-4099-b6c8-3df01d7a9ed2",
    createdAt: "2023-09-26T14:55:09.547Z",
    updatedAt: "2024-05-27T05:24:22.472Z",
    __v: 0,
  },
  {
    _id: "a9bc9c36-608d-4227-9896-ab14182d5971",
    question: "worsenedCondition",
    expectedAnswer: "other",
    isActive: false,
    mandatory: true,
    answerType: "number",
    sectionLabel: "health_check",
    locationId: "111bb5fc-e78f-4099-b6c8-3df01d7a9ed2",
    createdAt: "2023-09-26T14:54:40.694Z",
    updatedAt: "2024-05-27T05:24:27.173Z",
    __v: 0,
  },
];

export const getHealthQuestionnairesAll = (): Promise<IHealthQuestionnaire[]> =>
  new Promise((resolve, reject) => {
    if (!result) {
      return setTimeout(() => reject(new Error("Users not found")), 250);
    }

    setTimeout(() => resolve(result as IHealthQuestionnaire[]), 2000);
  });
