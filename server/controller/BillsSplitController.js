import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

export const Split = async (req, res) => {
  try {
    const amount = req.body.amount;
    const description = req.body.description;
    const date = req.body.date;
    const user_ids = req.body.userList;
    const loggedIn_id = req.user._id.toString();
    const category = 'BILLS SPLIT';
    user_ids.push(loggedIn_id);

    const number_of_splits = user_ids.length;
    const actual_amount = amount / number_of_splits;
    user_ids.forEach(async (user_id) => {
      let final_user_id = user_id.value ? user_id.value : user_id;
      let id = mongoose.mongo.ObjectId.createFromHexString(final_user_id);
      const transaction = new Transaction({
        amount: actual_amount,
        description,
        user_id: id,
        date,
        category,
      });
      await transaction.save();
    });
    res.status(200).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
};
