"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyTemplate = void 0;
const VerifyTemplate = (otp = '') => {
    return (`<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style=" margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
       <a href="https://idcheck.ng" style="font-size: 1.4em; color: #00466a; text-decoration: none; font-weight: 600;">
          <img width="200" src="https://idcheck.ng/img/logo/logo-dark-full.png" alt="IDcheck" />
          <p style="text-color:blue">IDcheck.ng</p>
        </a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing IDcheck. Use the following OTP to complete your Sign Up procedures. OTP is valid for 2 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br /><img width="200" src="https://idcheck.ng/img/logo/logo-dark-full.png" alt="IDcheck" />
  </p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>IDchecks</p>
      <p>+03601 885399</p>
      <p>Nigeria</p>
    </div>
  </div>
  </div>`);
};
exports.VerifyTemplate = VerifyTemplate;
