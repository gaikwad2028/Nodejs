import { asyncHandler } from "../utils/asyncHandeler.js";
import axios from "axios";
import sha256 from "sha256";
import uniqid from 'uniqid'
import { MERCHANT_ID,SALT_KEY,SALT_INDEX,PHONE_PE_HOST_URL } from "../constant.js";

const registerUser = asyncHandler(async(req,res) => {
  // res.status(200).json({ message: 'Success' });
  console.log('req--',req)
  let userId = "MUID123";
  let merchantTransactionId = uniqid()


  let normalPayLoad = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: userId,
      amount: 400 * 100,
      redirectUrl: `http://localhost:8000/redirect-url/${merchantTransactionId}`,
      redirectMode: "REDIRECT",
      mobileNumber: "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    let bufferObj = Buffer.from(JSON.stringify(normalPayLoad), "utf8");
    let base64EncodedPayload = bufferObj.toString("base64");
    let string = base64EncodedPayload + "/pg/v1/pay" + SALT_KEY;
    let sha256_val = sha256(string);
    let xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

    axios
    .post(
      `${PHONE_PE_HOST_URL}/pg/v1/pay`,
      {
        request: base64EncodedPayload,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyChecksum,
          accept: "application/json",
        },
      }
    )
    .then(function (response) {
      console.log("response->", response.data.data);
      res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
    })
    .catch(function (error) {
      console.log('error',error)
      res.send(error);
    });
})

export default registerUser