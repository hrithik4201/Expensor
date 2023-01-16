import User from '../models/User.js';

export const index = (req, res) => {
  res.json({ user: req.user });
};

export const getAllUsers = async (req, res) => {
  try {
    console.log('Hello World');
    const all_users = await User.find();
    console.log(all_users);
    res.json({ all_users });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};
