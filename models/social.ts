import { User } from "firebase";

export interface SocialModel {
  id?: string;
  eventDate: number;
  eventDescription: string;
  eventImage: string;
  eventLocation: string;
  eventName: string;
  // TODO: You may need to add attributes here
  // to implement your desired functionality.
  // The staff solutions add two attributes.
  creatorID: String;
  interested: String[];
}
