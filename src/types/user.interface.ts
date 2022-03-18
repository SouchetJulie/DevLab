import { EGrade } from "./grade.enum";
import { ESubject } from "./subject.enum";
import { ObjectId } from "bson";

/**
 * Used for authentication
 */
export interface IUserAuth {
  email: string;
  password?: string; // to be removed outside of auth
}

/**
 * Used for creating a new User
 */
export interface IUserCreate extends IUserAuth {
  picture?: string;
  firstName?: string;
  lastName?: string;
  description?: string;
}

/**
 * **All** data about a user.
 * @property {string} _id optional
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {File} avatar
 * @property {Date} joinDate
 * @property {string} description
 * @property {string} location
 * @property {EGrade[]} grades
 * @property {ESubject[]} subjects
 * @property {string[]} postIds
 * @property {string[]} bookmarkIds
 * @property {string[]} commentIds
 */
export interface IUserDB extends IUserCreate {
  _id?: ObjectId; // used in database
  avatar?: File;
  joinDate: Date;
  description: string;
  location: string;
  grades: EGrade[];
  subjects: ESubject[];
  // foreign keys
  lessonIds: ObjectId[];
  bookmarkIds: ObjectId[];
  commentIds: ObjectId[];
}

/**
 * Used for sending data to the client about a User
 */
export type IUserPublic = Omit<IUserDB, "password">;
