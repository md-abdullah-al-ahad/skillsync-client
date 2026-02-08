import { LucideIcon } from "lucide-react";

export interface Route {
  title: string;
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}
