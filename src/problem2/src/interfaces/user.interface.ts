import { GENDER, USER_TYPE } from "src/enums/user.enum";
import { IBaseEntity } from ".";

export interface IUser extends IBaseEntity {
  firstName: string;
  lastName: string;
  middleName: string;
  aliasName?: string;
  avatarUrl?: string;
  dob: string | number;
  gender: GENDER;
  email?: string;
  secondEmail: string;

  userType: USER_TYPE;
  address: string;
  postalCode: string;
  state: string;
  suburb: string;
  country: string;
  phoneNumber: string;
  locationId?: string;
  timezone?: string;
  brandId: string;

  memberId: number;
  defaultLocationId?: string;
  locationIds?: string[];
  customerId?: string;
}
