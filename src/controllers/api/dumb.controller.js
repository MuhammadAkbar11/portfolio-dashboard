import { TransfromError } from "../../helpers/baseError.helper.js";
import { sendEmail } from "../../helpers/email.helper.js";

export const getDummy = (req, res) => {
  const data = [...Array(10).keys()].map(i => {
    let item = i + 1;
    return {
      title: `Title of Dummy ${item}`,
      body: `This body of Dummy ${item}`,
    };
  });

  res.json({
    dummies: data,
  });
};

export const postDummy = (req, res) => {
  res.json({
    message: "Thanks for you request",
    data: req.body,
  });
};

export const sendDummyEmail = async (req, res, next) => {
  const { message } = req.query;
  try {
    const email = await sendEmail({
      from: "muhammadakbarletlet@gmail.com",
      to: "baaev.legieuvn@gmail.com",
      subject: "Message",
      text: message ?? "I hope this message gets through!",
    });

    res.json({ message: "succes email", email });
  } catch (error) {
    error.responseType = "json";
    const trError = new TransfromError(error);

    next(trError);
  }
};
