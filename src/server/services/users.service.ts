import {
  IUserAuth,
  IUserCreate,
  IUserDB,
  IUserPublic,
} from "@typing/user.interface";
import bcrypt from "bcryptjs";
import { InsertOneResult, ObjectId } from "mongodb";
import { getDatabase } from "./database.service";

const collection = (await getDatabase()).collection<IUserDB>("User");
// Create index for speeding up search
collection.createIndex({ email: 1 });

/**
 * Fetches all users from database.
 *
 * @return {Promise<IUserPublic[]>} The list (possibly empty) of all users found.
 */
export const getAllUsers: () => Promise<IUserPublic[]> = async () => {
  const users = await collection.find({}).toArray();
  // remove password before sending it back
  users.forEach((user: IUserDB) => delete user.password);
  console.log(`[DB] Retrieved ${users.length} users from DB.`);
  return users.map(fromDatabase);
};

/**
 * Fetches one user from database.
 *
 * @param {string} email Email of the user to fetch.
 * @return {Promise<IUserPublic | null>} The user, or null if not found.
 */
export const getUserByEmail = async (
  email: string
): Promise<IUserPublic | null> => {
  const user = await collection.findOne({ email: email });

  if (!user) {
    return null;
  }
  // remove password before sending it back
  delete user.password;
  console.log(`[USER] Retrieved user ${user.email} from DB.`);
  return fromDatabase(user);
};

/**
 * Fetches one user from database.
 *
 * @param {string} userId Id (_id) of the user to fetch.
 * @return {Promise<IUserPublic | null>} The user, or null if not found.
 */
export const getOneUser = async (
  userId: string
): Promise<IUserPublic | null> => {
  const user: IUserDB | null = await collection.findOne({
    _id: new ObjectId(userId),
  });

  if (!user) {
    console.warn(`[USER] Failed to get user ${userId}: not found`);
    return null;
  }

  // remove password before sending it back
  delete user.password;
  console.log(`[USER] Retrieved user ${user.email} from DB.`);
  return fromDatabase(user);
};

/**
 * Inserts a new user in database.
 *
 * @param {IUserCreate} user User to insert.
 * @return {Promise<InsertOneResult<IUserDB>>} The result of the insertion.
 * @throws {Error} If the credentials are invalid or already in use.
 */
export const createNewUser = async (
  user: IUserCreate
): Promise<InsertOneResult<IUserDB>> => {
  if (!user.password || !user.email) {
    throw new Error("Données manquantes.");
  }
  // Is email already taken?
  const foundInDB = await collection.findOne<IUserDB>({ email: user.email });

  if (foundInDB) {
    throw new Error("Cet e-mail est déjà utilisé.");
  }

  const hashedPassword = bcrypt.hashSync(user.password, 13);

  const userDB: Omit<IUserDB, "_id"> = {
    ...initEmptyUser(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    password: hashedPassword,
  };
  return collection.insertOne(userDB);
};

/**
 * Checks whether the given user credentials are valid or not.
 * @param {IUserAuth} user
 * @return {Promise<boolean>}
 */
export const checkCredentials = async (user: IUserAuth): Promise<boolean> => {
  try {
    const userDB = await collection.findOne<IUserDB>({
      email: user.email,
    });

    if (!userDB?.password || !user?.password) {
      return false;
    }

    return bcrypt.compare(user.password, userDB.password);
  } catch (e) {
    console.warn("[DB] Could not connect to database");
    return false;
  }
};

/**
 * Checks whether the given object is of User type.
 * @param {Record<string, any>} user
 * @return {boolean}
 */
export const isUser = (user: Record<string, any>): user is IUserDB => {
  return user && user["error"] === undefined && user["email"];
};

/**
 * Adds the given lesson id to the list of lessons published by this user.
 * @param {IUserPublic} user
 * @param {ObjectId} lessonId
 */
export const addLessonToUser = async (
  user: IUserPublic,
  lessonId: ObjectId
) => {
  return collection.updateOne(
    { email: user.email },
    { $push: { lessonIds: lessonId } }
  );
};

/**
 * Creates an empty User with default values.
 * @return {IUserDB}
 */
const initEmptyUser = (): IUserDB => {
  return {
    // set default values
    joinDate: new Date(),
    description: "",
    location: "",
    // foreign keys
    grades: [],
    subjects: [],
    lessonIds: [],
    bookmarkIds: [],
    commentIds: [],
    // authentication parameters
    email: "",
    firstName: "",
    lastName: "",
  };
};

const fromDatabase = (user: IUserDB): IUserPublic => ({
  ...user,
  _id: user._id!.toString(),
  lessonIds: user.lessonIds.map((id) => id.toString()),
  bookmarkIds: user.bookmarkIds.map((id) => id.toString()),
  commentIds: user.commentIds.map((id) => id.toString()),
});
