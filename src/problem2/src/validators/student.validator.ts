import dayjs from "dayjs";
import { object as OBJECT, array, object, string, number } from "yup";

//  ===== STUDENT  =====
const STUDENT_NAME = string().required("pleaseProvideTheStudentFirstName");

const STUDENT_SURNAME = string().required("pleaseProvideTheStudentLastName");

const STUDENT_ALIAS = string();

const STUDENT_DOB = number()
  .typeError("pleaseProvideAValidDateOfBirth")
  .required("pleaseProvideTheDateOfBirth")
  .label("dob")
  .test("dob", (value, { createError }) => {
    if (dayjs(value).format("YYYY-MM-DD") === "Invalid date") {
      return createError({
        message: "pleaseProvideAValidDateOfBirth",
      });
    }

    if (dayjs(value).isAfter(dayjs())) {
      return createError({
        message: "dateOfBirthMustBeInThePast",
      });
    }

    const maxYearsLimit = dayjs().subtract(200, "year");

    if (dayjs(value).isBefore(maxYearsLimit)) {
      return createError({
        message: "dateOfBirthCannotBeOver200YearsAgo",
      });
    }

    const eighteenYearsAgo = dayjs().subtract(18, "year");

    if (dayjs(value).isAfter(eighteenYearsAgo)) {
      return createError({
        message: "ageMustBeAtLeast18YearsOld",
      });
    }

    return true;
  });

const STUDENT_GENDER = string().required("pleaseProvideTheStudentGender");

const STUDENT_MEMBER_NUMBER = string().required(
  "pleaseProvideTheStudentMemberNumber",
);

const STUDENT_PHONE_NUMBER = string().required(
  "pleaseProvideTheStudentPhoneNumber",
);

const STUDENT_EMAIL_ADDRESS = string()
  .email("pleaseProvideAValidEmailAddress")
  .required("pleaseProvideTheStudentEmailAddress");

const STUDENT_RELATIONSHIP = string().required(
  "pleaseProvideTheStudentRelationship",
);

const STUDENT_JOINING_DATE = string().required(
  "pleaseProvideTheStudentJoiningDate",
);

const STUDENT_LOCATION = string().required("pleaseProvideTheStudentLocation");

const STUDENT_LEVEL = string().required("pleaseProvideTheStudentLevel");

const STUDENT_TIMEZONE = string().required("pleaseProvideTheStudentTimezone");

const STUDENT_EMERGENCY_CONTACT_NAME = string().required(
  "pleaseProvideTheEmergencyContactFirstName",
);

const STUDENT_EMERGENCY_CONTACT_SURNAME = string().required(
  "pleaseProvideTheEmergencyContactLastName",
);

const STUDENT_EMERGENCY_CONTACTS = array(
  object({
    contactName: STUDENT_EMERGENCY_CONTACT_NAME,
    contactSurname: STUDENT_EMERGENCY_CONTACT_SURNAME,
    phoneNumber: STUDENT_PHONE_NUMBER,
    relationship: STUDENT_RELATIONSHIP,
  }),
).required("pleaseProvideAtLeastOneEmergencyContact");

const STUDENT_EMAIL_ADDRESS_NO_REQUIRED = string().email(
  "pleaseProvideAValidEmailAddress",
);

const STUDENT_PHONE_NUMBER_NO_REQUIRED = string();

const STUDENT_MAKE_UP_CREDIT_VALUE = number()
  .typeError("theMakeupCreditMustBeANumber")
  .min(1, "theMakeupCreditMustBeGreaterThan0")
  .max(10000, "theMakeupCreditMustBeLessThan10000");

//  ===== END STUDENT  =====

const validations = {
  OBJECT,
  string,
  number,
  STUDENT_NAME,
  STUDENT_SURNAME,
  STUDENT_ALIAS,
  STUDENT_DOB,
  STUDENT_GENDER,
  STUDENT_MEMBER_NUMBER,
  STUDENT_PHONE_NUMBER,
  STUDENT_EMAIL_ADDRESS,
  STUDENT_RELATIONSHIP,
  STUDENT_JOINING_DATE,
  STUDENT_LOCATION,
  STUDENT_LEVEL,
  STUDENT_TIMEZONE,
  STUDENT_EMERGENCY_CONTACTS,
  STUDENT_EMAIL_ADDRESS_NO_REQUIRED,
  STUDENT_PHONE_NUMBER_NO_REQUIRED,
  STUDENT_MAKE_UP_CREDIT_VALUE,
};
export default validations;
