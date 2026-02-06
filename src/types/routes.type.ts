import { ReactNode } from "react";

export interface Route {
  title: string;
  items: {
    title: string;
    url: string;
    icon?: ReactNode;
  }[];
}
