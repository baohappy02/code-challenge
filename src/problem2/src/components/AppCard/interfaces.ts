import { HTMLAttributes, ReactNode } from 'react';

export interface IAppCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
export interface IAppCardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  suffix?: ReactNode;
}
export interface IAppCardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}
export interface IAppCardContentItemProps
  extends HTMLAttributes<HTMLDivElement> {
  subtitle?: string;
  title?: string;
  isColor?: boolean;
  children?: ReactNode;
  isHtml?: boolean;
}
