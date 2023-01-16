import Transaction from '../models/Transaction.js';

export const filter = async (req, res) => {
  try {
    let priceRange = req.query.priceCategory;
    let sAmount = 0;
    let eAmount = 0;
    switch (priceRange) {
      case 'option1':
        sAmount = 0;
        eAmount = 999;
        break;

      case 'option2':
        sAmount = 1000;
        eAmount = 5000;
        break;

      case 'option3':
        sAmount = 5000;
        eAmount = 10000;
        break;

      case 'option4':
        sAmount = 10000;
        eAmount = 100000;
        break;

      default:
        sAmount = 0;
        eAmount = 100000;
        break;
    }

    let match = {};

    match.user_id = req.user._id;

    match.amount =
      req.query.amount == undefined ? 0 : parseInt(req.query.amount);
    let sDate = req.query.sDate;
    let eDate = req.query.eDate;
    if (sDate == 'undefined' && eDate == 'undefined') {
      sDate = new Date(new Date()).setHours(0, 0, 0);
      eDate = new Date(new Date()).setHours(23, 59, 59);
    } else if (sDate == 'undefined') {
      sDate = new Date(new Date()).setHours(0, 0, 0);
      eDate = new Date(eDate).setHours(23, 59, 59);
    } else if (eDate == 'undefined') {
      sDate = new Date(sDate).setHours(0, 0, 0);
      eDate = new Date(new Date()).setHours(23, 59, 59);
    } else {
      sDate = new Date(sDate).setHours(0, 0, 0);
      eDate = new Date(eDate).setHours(23, 59, 59);
    }
    match.date = {
      $gte: new Date(sDate),
      $lte: new Date(eDate),
    };

    match.amount = { $gte: sAmount, $lte: eAmount };
    if (req.query.category === 'All') {
      const demo = await Transaction.aggregate([
        {
          $match: match,
        },
        {
          $group: {
            _id: { $month: '$date' },
            transactions: {
              $push: {
                amount: '$amount',
                description: '$description',
                date: '$date',
                category: '$category',
                type: '$type',
                _id: '$_id',
              },
            },
            totalExpenses: { $sum: '$amount' },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      res.json({ data: demo });
    }
    match.category = new RegExp(req.query.category, 'i');

    const demo = await Transaction.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: { $month: '$date' },
          transactions: {
            $push: {
              amount: '$amount',
              description: '$description',
              date: '$date',
              category: '$category',
              type: '$type',
              _id: '$_id',
            },
          },
          totalExpenses: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json({ data: demo });
  } catch (error) {
    res.status(500).send();
  }
};
