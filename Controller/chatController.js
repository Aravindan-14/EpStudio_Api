import { promisePool as db } from "../config/db.js";

export const getSenderChatId = async (req, res) => {
  const sql = "SELECT * FROM chatmaster WHERE sender_ID = ?";

  try {
    const response = await db.query(sql, [req.body.id]);

    console.log(response);

    if (response) {
      res.status(200).send({
        message: "success",
        status: 200,
        data: response,
      });
    } else {
      res.status(404).send({
        message: "No data found",
        status: 404,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal Server Error",
      status: 500,
    });
  }
};

export const getAllChatId = async (req, res) => {
  const { id } = req.body;

  try {
    const sql = `
      SELECT chatmaster.*, user.name AS senderName
      FROM chatmaster
      JOIN user ON chatmaster.sender_ID = user.id
      WHERE chatmaster.receiver_ID = ?;
    `;

    const [chatList] = await db.query(sql, [id]);

    if (chatList.length > 0) {
      res.status(200).send({
        message: "success",
        status: 200,
        data: chatList,
      });
    } else {
      res.status(404).send({
        message: "No chats found",
        status: 404,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal Server Error",
      status: 500,
    });
  }
};

export const getMyMessage = async (req, res) => {
  const { chat_ID } = req.body; // Assuming chat_ID is sent in the body directly
  console.log(req.body);

  if (!chat_ID) {
    return res.status(400).send({
      message: "chat_ID is required",
      status: 400,
    });
  }

  try {
    const sql = `
      SELECT * 
      FROM message 
      WHERE chat_ID = ?;
    `;

    const [messages] = await db.query(sql, [chat_ID]);

    if (messages.length > 0) {
      return res.status(200).send({
        message: "success",
        status: 200,
        data: messages,
      });
    } else {
      return res.status(404).send({
        message: "No message found",
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return res.status(500).send({
      message: "Internal Server Error",
      status: 500,
    });
  }
};

export const CreateChatID = async (req, res) => {
  const data = req.body;
  try {
    const sql =
      "INSERT INTO chatmaster ( chat_ID, sender_ID, receiver_ID) VALUES (?, ?, ?)";

    const result = await db.query(sql, [
      data.chat_ID,
      data.sender_ID,
      data.receiver_ID,
    ]);

    res.status(200).json({ message: "Chat ID created successfully", result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred to create Chat ID", error });
  }
};
