import "./index.scss";

import {
  useEffect,
  useState,
  useCallback,
  Fragment,
  useMemo,
  memo,
} from "react";
import { Resolver, useForm, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs, { Dayjs } from "dayjs";
import { HiXMark } from "react-icons/hi2";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import { useTranslation } from "react-i18next";
import yup from "src/validators/student.validator";
import { ListHealthQuestionnaireDto } from "src/dtos/healthQuestionnaire.dto";
import {
  HEALTH_ANSWER,
  HEALTH_ANSWER_TYPE,
  HEALTH_EXPECTED_ANSWER,
} from "src/enums/healthQuestionnaire.enum";
import { FormCreateStudentDto } from "src/dtos/student.dto";
import { getHealthQuestionnairesAll } from "src/services/healthQuestionnaire.service";
import AppCard, { AppCardHeader } from "src/components/AppCard";
import AppInput from "src/components/AppInput";
import AppDatePicker from "src/components/AppDatePicker";
import AppGenderInput from "src/components/AppGenderInput";
import AppPhoneNumberInput from "src/components/AppPhoneNumberInput";
import AppLoadingContainer from "src/components/AppLoadingContainer";
import { formatData } from "src/helpers/dataFormat.helper";
import AppTextArea from "src/components/AppTextArea";
import AppSwitch from "src/components/AppSwitch";
import { convertToUnixTime } from "src/helpers/time.helper";
import { GENDER_VALUE } from "src/enums/student.enum";
import AppButton from "src/components/AppButton";
import { LANGUAGE } from "src/enums/language.enum";
import { KEY_LANGUAGE } from "src/constants/localStorage.constant";

const validationSchema = yup.OBJECT({
  firstName: yup.STUDENT_NAME,
  lastName: yup.STUDENT_SURNAME,
  aliasName: yup.STUDENT_ALIAS,
  dob: yup.STUDENT_DOB,
  gender: yup.STUDENT_GENDER,
  locationId: yup.STUDENT_LOCATION,
  emergencyContacts: yup.STUDENT_EMERGENCY_CONTACTS,
});

const StudentAddForm = () => {
  const {
    t,
    ready: isTranslationReady,
    i18n: { language, changeLanguage },
  } = useTranslation();

  const [loadingQuest, setLoadingQuest] = useState(true);

  const [isDisable, setDisable] = useState(true);

  const [questionList, setQuestionList] = useState<
    ListHealthQuestionnaireDto[]
  >([]);

  const handleChangeLanguage = useCallback(() => {
    const newLang = language === LANGUAGE.EN ? LANGUAGE.VI : LANGUAGE.EN;

    localStorage.setItem(KEY_LANGUAGE, newLang);
    changeLanguage(newLang);
  }, [language, changeLanguage]);

  const __checkShowQuestError = useCallback(
    (quest: ListHealthQuestionnaireDto): boolean => {
      const __isCorrectAnswer = (): boolean => {
        if (quest.mandatory) {
          if (quest?.answerType === HEALTH_ANSWER_TYPE.STRING) {
            return !quest?.answer;
          }

          if (quest?.answerType === HEALTH_ANSWER_TYPE.NUMBER) {
            if (quest?.expectedAnswer === HEALTH_EXPECTED_ANSWER.YES) {
              return quest?.answer !== HEALTH_ANSWER.YES;
            }

            if (quest?.expectedAnswer === HEALTH_EXPECTED_ANSWER.NO) {
              return quest?.answer !== HEALTH_ANSWER.NO;
            }
          }
        }

        return false;
      };

      return __isCorrectAnswer();
    },
    [],
  );

  const {
    register,
    setValue,
    control,
    clearErrors,
    trigger,
    setError,
    getValues,
    formState: { errors },
  } = useForm<FormCreateStudentDto>({
    resolver: yupResolver(validationSchema) as Resolver<FormCreateStudentDto>,
    defaultValues: {
      emergencyContacts: [
        {
          contactName: "",
          contactSurname: "",
          phoneNumber: "",
          relationship: "",
        },
      ],
    },
  });

  const watchAllFields = useWatch({ control });

  const { fields, append, remove } = useFieldArray({
    name: "emergencyContacts",
    control,
  });

  const handleAddMore = useCallback(() => {
    append({
      contactName: "",
      contactSurname: "",
      phoneNumber: "",
      relationship: "",
    });
  }, [append]);

  const handleRemoveEmergencyContact = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  const questListValidate = useCallback((): boolean => {
    if (!questionList?.length && !loadingQuest) return true;

    return !!questionList
      ?.filter((q) => q.mandatory)
      .every((item: ListHealthQuestionnaireDto) => {
        if (item.answerType === HEALTH_ANSWER_TYPE.STRING) {
          return !!item?.answer;
        }

        if (item.answerType === HEALTH_ANSWER_TYPE.NUMBER) {
          if (item.expectedAnswer === HEALTH_EXPECTED_ANSWER.YES) {
            return item?.answer === HEALTH_ANSWER.YES;
          }

          if (item.expectedAnswer === HEALTH_EXPECTED_ANSWER.NO) {
            return item?.answer === HEALTH_ANSWER.NO;
          }
        }

        return !!item?.answer;
      });
  }, [questionList, loadingQuest, errors]);

  const validateFieldDOB = useMemo(
    () =>
      !(dayjs(watchAllFields?.dob).format("YYYY-MM-DD") === "Invalid Date") &&
      !dayjs(watchAllFields?.dob).isAfter(dayjs()) &&
      !dayjs(watchAllFields?.dob).isBefore(dayjs().subtract(200, "year")),
    [watchAllFields?.dob],
  );

  useEffect(() => {
    const noEmptyECS = watchAllFields.emergencyContacts?.every(
      (emergencyContact) => {
        return Object.values(emergencyContact)?.every((value) => !!value);
      },
    );

    const noECsErrorValues = () => {
      if (errors?.emergencyContacts) {
        // @ts-ignore
        return !errors?.emergencyContacts
          ?.filter((ec) => !!ec)
          ?.filter(
            (values: any) =>
              Object.values(values)?.filter((values) => !values)?.length,
          );
      }

      return true;
    };

    if (
      watchAllFields.firstName &&
      watchAllFields.lastName &&
      validateFieldDOB &&
      watchAllFields.gender &&
      noEmptyECS &&
      noECsErrorValues() &&
      questListValidate()
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [
    watchAllFields,
    errors,
    questionList,
    questListValidate,
    validateFieldDOB,
  ]);

  const handleChangeQuestionAnswer = useCallback(
    (questionId: string, val?: string) => {
      setQuestionList((pre) => {
        const tempArr = [...pre];

        const newArr = tempArr.map((item) => {
          if (item._id === questionId) {
            return { ...item, answer: val };
          }

          return item;
        });

        return newArr;
      });
    },
    [],
  );

  const handleChange = useCallback(
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      index?: number,
    ) => {
      if (event.target.name === "firstName") {
        setValue("aliasName", event.target.value);
      }

      switch (event.target.name) {
        case "contactName":
          if (typeof index === "number" && index >= 0)
            setValue(
              `emergencyContacts.${index}.contactName`,
              event.target.value,
            );

          // @ts-ignore
          trigger(`emergencyContacts.${index}.contactName`);
          break;

        case "contactSurname":
          if (typeof index === "number" && index >= 0)
            setValue(
              `emergencyContacts.${index}.contactSurname`,
              event.target.value,
            );

          // @ts-ignore
          trigger(`emergencyContacts.${index}.contactSurname`);
          break;

        case "relationship":
          if (typeof index === "number" && index >= 0)
            setValue(
              `emergencyContacts.${index}.relationship`,
              event.target.value,
            );

          // @ts-ignore
          trigger(`emergencyContacts.${index}.relationship`);
          break;

        default:
          // @ts-ignore
          setValue(event.target.name, event.target.value);

          // @ts-ignore
          trigger(event.target.name);
          break;
      }
    },
    [setValue, trigger],
  );

  const handleChangeDOB = useCallback(
    (val: Dayjs | null) => {
      setValue("dob", convertToUnixTime(dayjs(val)?.format()));

      trigger("dob");
    },
    [setValue, trigger],
  );

  const handleChangeGender = useCallback(
    (val: string) => {
      setValue("gender", val as GENDER_VALUE);

      trigger("gender");
    },
    [setValue, trigger],
  );

  const handleChangePhoneNumber = useCallback(
    (val: string, index?: number) => {
      if (typeof index !== "number" || index < 0) return;

      setValue(`emergencyContacts.${index}.phoneNumber`, val);

      if (!val) {
        clearErrors(`emergencyContacts.${index}.phoneNumber`);

        return;
      }

      const phoneNumberCondition = !!(
        isValidPhoneNumber(val) && isPossiblePhoneNumber(val)
      );

      if (phoneNumberCondition) {
        const isConflicts = watchAllFields?.emergencyContacts?.filter(
          (ec) => ec?.phoneNumber === val,
        )?.length;

        if (!isConflicts) {
          // setIsCheckOnServer(true);

          clearErrors(`emergencyContacts.${index}.phoneNumber`);

          // checkExisting(`emergencyContacts.${index}.phoneNumber`, val);
        }
      } else {
        setError(`emergencyContacts.${index}.phoneNumber`, {
          type: "custom",
          message: t("invalidPhoneNumber"),
        });
      }
    },
    [setValue, clearErrors, setError, watchAllFields?.emergencyContacts, t],
  );

  useEffect(() => {
    if (!getValues().emergencyContacts?.length) return;

    const groups: any = {};

    getValues().emergencyContacts.forEach((obj, idx) => {
      const value = obj.phoneNumber;
      if (value) {
        groups[value] = groups[value] || [];
        groups[value].push(idx);
      }
    });

    const results: any[] = Object.values(groups).filter(
      (indexes: any) => indexes.length > 1,
    );

    const result: number[] = [].concat(...results).sort((a, b) => a - b);

    for (const [
      key,
      emergencyContact,
    ] of getValues().emergencyContacts.entries()) {
      if (
        key > 0 &&
        emergencyContact?.phoneNumber &&
        isValidPhoneNumber(emergencyContact?.phoneNumber) &&
        isPossiblePhoneNumber(emergencyContact?.phoneNumber)
      ) {
        if (result?.includes(key)) {
          setError(`emergencyContacts.${key}.phoneNumber`, {
            type: "custom",
            message: t("thisPhoneNumberIsUsedByOtherEmergencyContacts"),
          });
        } else {
          clearErrors(`emergencyContacts.${key}.phoneNumber`);
        }
      }
    }
  }, [setError, clearErrors, getValues, t]);

  const triggerValidate = useCallback(() => {
    const triggerList = [
      ...(!watchAllFields?.firstName ? ["firstName"] : []),
      ...(!watchAllFields?.lastName ? ["lastName"] : []),
      ...(!watchAllFields?.gender ? ["gender"] : []),
      ...(!watchAllFields?.locationId ? ["locationId"] : []),
      ...(!validateFieldDOB ? ["dob"] : []),
    ];

    if (triggerList?.length) {
      // @ts-ignore
      trigger(triggerList);
    }

    if (!getValues().emergencyContacts?.length) return;

    const groups: any = {};

    getValues().emergencyContacts.forEach((obj, idx) => {
      const value = obj.phoneNumber;
      if (value) {
        groups[value] = groups[value] || [];
        groups[value].push(idx);
      }
    });

    const results: any[] = Object.values(groups).filter(
      (indexes: any) => indexes.length > 1,
    );

    const result: number[] = [].concat(...results).sort((a, b) => a - b);

    for (const [
      key,
      emergencyContact,
    ] of getValues().emergencyContacts.entries()) {
      if (key > 0) {
        if (
          result?.includes(key) &&
          emergencyContact?.phoneNumber &&
          isValidPhoneNumber(emergencyContact?.phoneNumber) &&
          isPossiblePhoneNumber(emergencyContact?.phoneNumber)
        ) {
          trigger([
            `emergencyContacts.${key}.contactName`,
            `emergencyContacts.${key}.contactSurname`,
            `emergencyContacts.${key}.relationship`,
          ]);

          setError(`emergencyContacts.${key}.phoneNumber`, {
            type: "custom",
            message: t("thisPhoneNumberIsUsedByOtherEmergencyContacts"),
          });
        } else {
          clearErrors(`emergencyContacts.${key}.phoneNumber`);

          trigger([
            `emergencyContacts.${key}.contactName`,
            `emergencyContacts.${key}.contactSurname`,
            `emergencyContacts.${key}.relationship`,
            `emergencyContacts.${key}.phoneNumber`,
          ]);
        }
      } else {
        trigger([`emergencyContacts.${key}.relationship`]);
      }
    }
  }, [
    t,
    trigger,
    setError,
    watchAllFields,
    validateFieldDOB,
    getValues,
    clearErrors,
  ]);

  const processSubmit = () => {
    console.log("FormData: \n", watchAllFields);
  };

  const handleSubmit = () => {
    if (isDisable) {
      triggerValidate();
    } else {
      processSubmit();
    }
  };

  const fetchData = useCallback(async () => {
    try {
      setLoadingQuest(true);

      const result = await getHealthQuestionnairesAll();

      setQuestionList(
        result
          .filter((item: ListHealthQuestionnaireDto) => item.isActive)
          .map((item: ListHealthQuestionnaireDto) => {
            if (item.answerType === HEALTH_ANSWER_TYPE.STRING) {
              return { ...item, answer: "" };
            } else {
              return { ...item, answer: HEALTH_ANSWER.NO };
            }
          }),
      );
    } catch (error) {
      setQuestionList([]);
    } finally {
      setLoadingQuest(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="studentAddForm__content disable-scroll xl:max-w-[60vw] 2xl:max-w-[864px] m-auto">
      {!isTranslationReady ? (
        <div className="flex flex-col items-center gap-20">
          <h1 className="text-2xl text-white opacity-20">
            loading translation
          </h1>
          <AppLoadingContainer />
        </div>
      ) : (
        <AppCard>
          <div className="studentAddForm__content-wrapper">
            <AppButton
              variant="secondary"
              className="ml-auto w-max"
              onClick={handleChangeLanguage}
            >
              <p className="m-0 p-0 text-xl leading-[1.25rem]">
                {t("changeLanguage")}:{" "}
                <span className="uppercase">{language}</span>
              </p>
            </AppButton>

            <h1 className="mt-8 text-3xl font-bold text-center text-white uppercase mb-14">
              {t("addStudentForm")}
            </h1>
            {/* PERSONAL INFORMATION */}
            <>
              <div className="studentAddForm__content-wrapper-header">
                <AppCardHeader title={t("personalInformation")} />
              </div>
              <div className="studentAddForm__content-personal_information">
                <div className="item">
                  <AppInput
                    {...register("firstName")}
                    label={`${t("firstName")}*`}
                    onChange={handleChange}
                    message={{
                      type: "error",
                      text: t(errors?.firstName?.message || ""),
                    }}
                  />
                </div>
                <div className="item">
                  <AppInput
                    {...register("lastName")}
                    label={`${t("lastName")}*`}
                    onChange={handleChange}
                    message={{
                      type: "error",
                      text: t(errors?.lastName?.message || ""),
                    }}
                  />
                </div>
                <div className="item">
                  <AppInput
                    {...register("aliasName")}
                    label={`${t("alias")}`}
                    onChange={handleChange}
                    message={{
                      type: "error",
                      text: t(errors?.aliasName?.message || ""),
                    }}
                  />
                </div>
                <div className="item">
                  <AppDatePicker
                    {...register("dob")}
                    label={`${t("dateOfBirth")}*`}
                    value={
                      watchAllFields?.dob ? dayjs(watchAllFields?.dob) : null
                    }
                    disableFuture
                    onChange={handleChangeDOB}
                    message={{
                      type: "error",
                      text: t(errors?.dob?.message || ""),
                    }}
                  />
                </div>
                <div className="item">
                  <AppGenderInput
                    {...register("gender")}
                    label={`${t("gender")}*`}
                    searchable={false}
                    defaultValue={watchAllFields?.gender}
                    onChangeGender={handleChangeGender}
                    message={{
                      type: "error",
                      text: t(errors?.gender?.message || ""),
                    }}
                  />
                </div>
              </div>
            </>

            {/* Emergency Contact */}
            <>
              <AppCardHeader title={t("emergencyContact")} />
              <div className="studentAddForm__content-emergency_contacts">
                <div className="studentAddForm__content-emergency_contacts_wrapper">
                  {fields.map((field, index) => (
                    <Fragment key={field.id}>
                      <div className="item_small">
                        <AppInput
                          {...register(
                            `emergencyContacts.${index}.contactName` as const,
                          )}
                          label={`${t("firstName")}*`}
                          onChange={(
                            event: React.ChangeEvent<
                              HTMLInputElement | HTMLTextAreaElement
                            >,
                          ) => handleChange(event, index)}
                          message={{
                            type: "error",
                            text: t(
                              errors?.emergencyContacts?.[index]?.contactName
                                ?.message || "",
                            ),
                          }}
                        />
                      </div>
                      <div className="item_small">
                        <AppInput
                          {...register(
                            `emergencyContacts.${index}.contactSurname` as const,
                          )}
                          label={`${t("lastName")}*`}
                          onChange={(
                            event: React.ChangeEvent<
                              HTMLInputElement | HTMLTextAreaElement
                            >,
                          ) => handleChange(event, index)}
                          message={{
                            type: "error",
                            text: t(
                              errors?.emergencyContacts?.[index]?.contactSurname
                                ?.message || "",
                            ),
                          }}
                        />
                      </div>
                      <div className="item">
                        <AppPhoneNumberInput
                          {...register(
                            `emergencyContacts.${index}.phoneNumber` as const,
                          )}
                          label={`${t("mobileNumber")}*`}
                          value={
                            watchAllFields?.emergencyContacts?.[index]
                              ?.phoneNumber || ""
                          }
                          onChange={(val: string) =>
                            handleChangePhoneNumber(val, index)
                          }
                          message={{
                            type: "error",
                            text: t(
                              errors?.emergencyContacts?.[index]?.phoneNumber
                                ?.message || "",
                            ),
                          }}
                        />
                      </div>
                      <div className="item">
                        <AppInput
                          {...register(
                            `emergencyContacts.${index}.relationship` as const,
                          )}
                          label={`${t("relationship")}*`}
                          onChange={(
                            event: React.ChangeEvent<
                              HTMLInputElement | HTMLTextAreaElement
                            >,
                          ) => handleChange(event, index)}
                          message={{
                            type: "error",
                            text: t(
                              errors?.emergencyContacts?.[index]?.relationship
                                ?.message || "",
                            ),
                          }}
                        />
                      </div>

                      <div className="item_single">
                        {!!fields.length && !!index ? (
                          <button
                            type="button"
                            className="border border-gray-500 rounded-lg"
                            onClick={() => handleRemoveEmergencyContact(index)}
                          >
                            <HiXMark fontSize={24} className="text-gray-500" />
                          </button>
                        ) : null}
                      </div>
                    </Fragment>
                  ))}
                </div>

                <button
                  type="button"
                  className="studentAddForm__content-emergency_contacts-btn_add_more"
                  onClick={handleAddMore}
                >
                  {t("addMore")}
                </button>
              </div>
            </>

            {/* Health Questionnaire */}
            <div>
              <AppCardHeader title={t("healthQuestionnaire")} />
              {/* custom quest list error message */}
              {!questListValidate() ? (
                <>
                  <div className="studentAddForm__content-health_questionnaire_not_field_err">
                    {t("pleaseFillHQ")}
                  </div>
                </>
              ) : null}

              <div className="studentAddForm__content__healthQuestionnaire">
                {loadingQuest ? (
                  <AppLoadingContainer />
                ) : questionList?.length ? (
                  questionList.map(
                    (item: ListHealthQuestionnaireDto, index) => (
                      <div
                        className={`${index === 0 ? "quest_border_top" : null} ${
                          index < questionList.length - 1
                            ? "quest_border_bot"
                            : null
                        } ${
                          item?.answerType === HEALTH_ANSWER_TYPE.STRING
                            ? "custom_flex_col"
                            : ""
                        } ${__checkShowQuestError(item) ? "showQuestError" : ""}`}
                        key={index}
                      >
                        <div className="health_quest">
                          <div className="quest">
                            {formatData(t(item?.question))}
                          </div>

                          {__checkShowQuestError(item) ? (
                            <div className="customQuestError">
                              <HiOutlineExclamationCircle fontSize={24} />

                              <div className="text">
                                {item?.answerType === HEALTH_ANSWER_TYPE.STRING
                                  ? ` ${t("expectedToHaveAnAnswer")}`
                                  : item.expectedAnswer === "other"
                                    ? `${t("expectedToHaveAnAnswer")}`
                                    : `${t("expectedAnswerIs")} ` +
                                      item.expectedAnswer}
                              </div>
                            </div>
                          ) : null}
                        </div>

                        {item?.answerType === HEALTH_ANSWER_TYPE.STRING ? (
                          <>
                            <AppTextArea
                              label=""
                              maxLength={500}
                              value={
                                item?.answer === HEALTH_ANSWER.NO
                                  ? ""
                                  : item?.answer
                              }
                              onChange={(event) =>
                                handleChangeQuestionAnswer(
                                  item._id,
                                  event.target.value,
                                )
                              }
                            />
                            <div className="input-limit">
                              {item.answer?.length}/500
                            </div>
                          </>
                        ) : (
                          <AppSwitch
                            label={[t("NO"), t("YES")]}
                            value={item?.answer === HEALTH_ANSWER.YES}
                            onChange={() => {
                              handleChangeQuestionAnswer(
                                item._id,
                                item?.answer === HEALTH_ANSWER.YES
                                  ? HEALTH_ANSWER.NO
                                  : HEALTH_ANSWER.YES,
                              );
                            }}
                          />
                        )}
                      </div>
                    ),
                  )
                ) : null}
              </div>
            </div>

            {/* Submit button */}

            <AppButton
              variant={isDisable ? "disabled" : "primary"}
              className="my-10 ml-auto"
              onClick={handleSubmit}
            >
              <p className="text-lg leading-[1.125rem]">
                {t("confirm")} & {t("submit")}
              </p>
            </AppButton>
          </div>
        </AppCard>
      )}
    </div>
  );
};

export default memo(StudentAddForm);
