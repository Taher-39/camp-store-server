// const SSLCommerzPayment = require("sslcommerz-lts");
// const User = require("../Models/authModel");
// const { v4: uuidv4 } = require("uuid");
// const { getFormattedDateTime } = require("../utils/dateTimeUtils");
// require("dotenv").config();

// const store_id = process.env.STORE_ID;
// const store_passwd = process.env.STORE_PASS;
// const is_live = false; //true for live, false for sandbox

// const addMoney = async (req, res) => {
//   const { name, email, amount, currency, country } = req.body;
//   const transactionId = uuidv4();
//   const data = {
//     total_amount: amount,
//     currency: currency,
//     tran_id: transactionId,
//     success_url: `https://agency-server-git-main-taher-39.vercel.app/payment/success?transactionId=${transactionId}`,
//     fail_url: `https://agency-server-git-main-taher-39.vercel.app/payment/fail?transactionId=${transactionId}`,
//     cancel_url: "https://agency-server-git-main-taher-39.vercel.app/payment/cancel",
//     ipn_url: "https://agency-server-git-main-taher-39.vercel.app/payment/ipn",
//     shipping_method: "Courier",
//     product_name: "Computer",
//     product_category: "Electronic",
//     product_profile: "general",
//     cus_name: name,
//     cus_email: email,
//     cus_add1: "Dhaka",
//     cus_add2: "Dhaka",
//     cus_city: "Dhaka",
//     cus_state: "Dhaka",
//     cus_postcode: "1000",
//     cus_country: country,
//     cus_phone: "01711111111",
//     cus_fax: "01711111111",
//     ship_name: name,
//     ship_add1: "Dhaka",
//     ship_add2: "Dhaka",
//     ship_city: "Dhaka",
//     ship_state: "Dhaka",
//     ship_postcode: 1000,
//     ship_country: country,
//   };

//   const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const newPayment = {
//       payableAmount: amount,
//       paidStatus: false,
//       tran_id: transactionId,
//       pay_initiat: getFormattedDateTime(),
//     };

//     user.paymentInfo.push(newPayment);
//     await user.save();

//     sslcz.init(data).then((apiResponse) => {
//       const GatewayPageURL = apiResponse.GatewayPageURL;
//       res.status(200).json({
//         url: GatewayPageURL,
//         message: "Payment information added successfully",
//         user,
//       });
//     });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// const paymentSuccess = async (req, res) => {
//   const { transactionId } = req.query;

//   try {
//     const user = await User.findOne({ "paymentInfo.tran_id": transactionId });

//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "User not found or no updates were made" });
//     }

//     const payment = user.paymentInfo.find(
//       (payment) => payment.tran_id === transactionId
//     );

//     if (!payment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     const payableAmount = payment.payableAmount;
//     user.amount += payableAmount;
//     payment.paidStatus = true;

//     await user.save();
//     return res.redirect(
//       `${process.env.CLIENT_URL}/success-screen?transactionId=${transactionId}`
//     );
//   } catch (error) {
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// const paymentFail = async (req, res) => {
//   const { transactionId } = req.query;

//   try {
//     const user = await User.findOne({ "paymentInfo.tran_id": transactionId });

//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "User not found or no updates were made" });
//     }

//     user.paymentInfo = user.paymentInfo.filter(
//       (payment) => payment.tran_id !== transactionId
//     );

//     await user.save();

//     return res.redirect(`${process.env.CLIENT_URL}/fail-screen`);
//   } catch (error) {
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// module.exports = {
//   addMoney,
//   paymentSuccess,
//   paymentFail,
// };