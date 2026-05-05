import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import { dbConnection } from '../config/mongoConnection.js';

const saltRounds = 12;

const getUsersCollection = async () => {
  const db = await dbConnection();
  return db.collection('users');
};

const checkString = (str, fieldName) => {
  if (!str || typeof str !== 'string') {
    throw `${fieldName} must be a valid string`;
  }

  str = str.trim();

  if (str.length === 0) {
    throw `${fieldName} cannot be empty`;
  }

  return str;
};

const validateEmail = (email) => {
  email = checkString(email, 'Email').toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw 'Invalid email address';
  }

  return email;
};

const validateUsername = (username) => {
  username = checkString(username, 'Username').toLowerCase();

  if (username.length < 3 || username.length > 25) {
    throw 'Username must be between 3 and 25 characters';
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;

  if (!usernameRegex.test(username)) {
    throw 'Username may only contain letters, numbers, and underscores';
  }

  return username;
};

const validatePassword = (password) => {
  password = checkString(password, 'Password');

  if (password.length < 8) {
    throw 'Password must be at least 8 characters';
  }

  if (!/[A-Z]/.test(password)) {
    throw 'Password must contain at least one uppercase letter';
  }

  if (!/[a-z]/.test(password)) {
    throw 'Password must contain at least one lowercase letter';
  }

  if (!/[0-9]/.test(password)) {
    throw 'Password must contain at least one number';
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    throw 'Password must contain at least one special character';
  }

  return password;
};

export const createUser = async (
  firstName,
  lastName,
  username,
  email,
  password
) => {
  firstName = checkString(firstName, 'First name');
  lastName = checkString(lastName, 'Last name');
  username = validateUsername(username);
  email = validateEmail(email);
  password = validatePassword(password);

  const usersCollection = await getUsersCollection();
  const existingUser = await usersCollection.findOne({
    $or: [
      { username: username.toLowerCase() },
      { email: email.toLowerCase() }
    ]
  });

  if (existingUser) {
    throw 'A user with that username or email already exists';
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = {
    firstName,
    lastName,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    role: 'user',
    hashedPassword,
    favoriteLocationIds: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const insertInfo = await usersCollection.insertOne(newUser);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw 'Could not create user';
  }

  return {
    _id: insertInfo.insertedId.toString(),
    firstName,
    lastName,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    role: 'user'
  };
};

export const getUserById = async (id) => {
  id = checkString(id, 'User ID');

  if (!ObjectId.isValid(id)) {
    throw 'Invalid user ID';
  }

  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({ _id: new ObjectId(id) });

  if (!user) {
    throw 'User not found';
  }

  user._id = user._id.toString();
  delete user.hashedPassword;

  return user;
};

export const getUserByUsernameOrEmail = async (identifier) => {
  identifier = checkString(identifier, 'Username or email').toLowerCase();

  const usersCollection = await getUsersCollection();
  const user = await usersCollection.findOne({
    $or: [
      { username: identifier },
      { email: identifier }
    ]
  });

  if (!user) {
    throw 'User not found';
  }

  user._id = user._id.toString();
  return user;
};

export const loginUser = async (identifier, password) => {
  identifier = checkString(identifier, 'Username or email').toLowerCase();
  password = checkString(password, 'Password');

  const user = await getUserByUsernameOrEmail(identifier);
  const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

  if (!passwordMatch) {
    throw 'Invalid username/email or password';
  }

  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    role: user.role
  };
};