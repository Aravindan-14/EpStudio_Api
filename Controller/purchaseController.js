import { promisePool as db } from "../config/db.js";
import nodemailer from "nodemailer";

//Create Purchase api start
export const createPurchase = (req, res) => {
  function sendMail(data, image) {
    var msgBody = "<h1>Customer details </h1><br>";
    for (let k in data) {
      msgBody += k + " : " + data[k] + "<br>";
    }

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "eyampoosu@gmail.com",
        pass: "etayeeapttxdbaxz",
      },
    });

    var mailOptions = {
      from: "eyampoosu@gmail.com",
      to: "aravindan2518@gmail.com",
      subject: "New Order Recived...!",
      html: msgBody,
      attachments: [
        {
          // use URL as an attachment
          filename: image.originalname,
          path: image.path,
        },
      ],
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.send({ status: "mail sent" });
      }
    });
  }

  function ConformationMail(data) {
    // var msgBody = "<h1>Order Confirmation Email</h1><br>";
    // for (let k in data) {
    //   msgBody += k + " : " + data[k] + "<br>";
    // }

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "eyampoosu@gmail.com",
        pass: "etayeeapttxdbaxz",
      },
    });

    var mailOptions = {
      from: "eyampoosu@gmail.com",
      to: `${data.email}`,
      subject: "Order Confirmation Email",
      html: `
     <b> Dear ${data.customer_Name},</b> 
     <br><br>
      <div>
      Thank you for purchasing <b>${data.product_Name}</b> from EP Studio. We truly appreciate your support and hope you love it.
      If you need any help, just let us know. Looking forward to serving you again!
      </div>
      <br>
     <div>
      Warm regards,<br>
      EP Studio</div>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.send({ status: "mail sent" });
      }
    });
  }

  const {
    customer_Name,
    email,
    phone_No,
    address,
    product_Name,
    quantity,
    price,
    Product_ID,
    Frame_Size,
    User_ID,
  } = req.body;

  console.log(req.body);

  const image = req.file;
  let value = [
    customer_Name,
    email,
    phone_No,
    address,
    product_Name,
    quantity,
    price,
    image.filename,
    Product_ID,
    Frame_Size,
    User_ID,
  ];

  sendMail(req.body, image);
  ConformationMail(req.body);
  const sql =
    "INSERT INTO orders (`customer_Name`,`email`,`phone_No`,`address`,`product_Name`,`quantity`,`price`,`image`,`Product_ID`,`Frame_Size`,`User_ID`) VALUES (?)";
  db.query(sql, [value], (err, result) => {
    if (err) return res.send(err);

    return res.send("succes");
  });
};

//GEt user All orders
export const getUserOrders = async (req, res) => {
  try {
    const sql = "SELECT * FROM orders";
    const [data] = await db.query(sql);

    console.log(data);

    res.status(200).json({
      success: true,
      orders: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching orders",
      error: error.message,
    });
  }
};
