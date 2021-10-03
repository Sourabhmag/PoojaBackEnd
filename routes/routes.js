const express = require("express");
const router = express.Router();
const Loan = require("../models/loanmodel");

router.get("/getData", function (req, res) {
  Loan.find()
    .then(async (res1, err) => {
      if (err) {
        res.status(502).send({
          status: false,
          err: err,
        });
      }

      res.status(200).send({
        status: true,
        data: res1,
      });
      // console.log(res1);
    })
    .catch((err) => console.log(err));
});

router.get("/getCollectionAgent", function (req, res) {
  Loan.find()
    .then(async (res1, err) => {
      if (err) {
        res.status(502).send({
          status: false,
          err: err,
        });
      }

      res.status(200).send({
        status: true,
        data: res1,
      });
      // console.log(res1);
    })
    .catch((err) => console.log(err));
});
 
router.get("/getemi", function (req, res) {
  //console.log(req.query.user);
  Loan.aggregate([
    {
      $match: {
        collectionAgent: req.query.collectionAgentName,
      },
    },
    {
      $unwind: "$emiData",
    },
    {
      $group: {
        _id: "$emiData.month",
        total: {
          $sum: "$emiData.emiPayment",
        },
      },
    },
  ])
    .then(async (res1, err) => {
      if (err) {
        res.status(502).send({
          status: false,
          err: err,
        });
      }

      res.status(200).send({
        status: true,
        data: res1,
        msg: "Successfully get amount",
      });
       //console.log(res1);
    })
    .catch((err) => console.log(err));
});

router.post("/postData", (req, res) => {
  let {
    customerName,
    loanAmount,
    paymentPeriod,
    emiPayment,
    foreClosurePayment,
    collectionAgent,
    paymentCycle,
  } = req.body;

  const errors = [];
  if (
    !customerName ||
    !loanAmount ||
    !paymentPeriod ||
    !emiPayment ||
    !foreClosurePayment ||
    !collectionAgent ||
    !paymentCycle
  ) {
    errors.push({ msg: "Please fill all fields" });
  }
  if (errors.length > 0) {
    return res.status(500).json({
      message: errors ? errors : "There are some errors",
    });
  }

  let emiData = [];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  let monthIndex = 0;
  while (loanAmount >= emiPayment) {
    if (emiPayment) {
      loanAmount = loanAmount - emiPayment;
      emiData.push({
        month: months[monthIndex % 12],
        loanAmount: loanAmount,
        emiPayment: emiPayment,
        foreClosurePayment: foreClosurePayment,
      });
      monthIndex++;
    }
  }
  emiData.pop();
  const loan = new Loan({
    customerName,
    emiData,
    paymentPeriod,
    collectionAgent,
    paymentCycle,
  });
  loan
    .save()
    .then((response, err) => {
      if (err) {
        res.status(502).send({
          status: false,
          message: "there was an error",
          error: err,
        });
      }

      res.status(200).send({
        status: true,
        message: "User Created Loan",
        id: response._id,
      });
    })
    .catch((e) => console.log(e));
});

module.exports = router;
