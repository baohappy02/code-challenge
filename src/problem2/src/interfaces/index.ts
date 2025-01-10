import { ReactNode } from "react";

export interface IOption {
  value: string | number;
  label: string;
  hint?: ReactNode;
  canNotBeRemoved?: boolean;
}

export interface IBaseEntity {
  _id: string;
  __v: number;
  updatedAt: string;
  createdAt: string;
  deletedAt?: string;
}
