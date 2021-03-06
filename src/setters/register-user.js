import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { Account, Person } from '../sql-models';

const registerUser = async ( input ) => {
  const { username, password, email, name } = input.registrationInput;

  const usernameTaken = await Account.query().findOne({ username });
  if (usernameTaken) return { message: `The username ${username} is already taken` };

  const hashedPassword = await bcrypt.hash(password, 10);
  const token = jwt.sign(
    { username },
    'tempi is a dog',
    { expiresIn: '24h' }
  );
  const personId = uuidv4();

  await Person.query().insert({ id: personId, name });
  await Account.query().insert({
    id: uuidv4(),
    person_id: personId,
    username,
    email,
    password: hashedPassword,
  })

  return {
    message: 'User created successfully!',
    username,
    token,
    name
  }
};

export default registerUser;
