import { Service } from "./Service";
import { User } from "./User";

export interface IRoom {
  _id: string;
  user: User;
  service: Service;
}