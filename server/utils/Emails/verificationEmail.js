require("dotenv").config();
const verificationEmail = (user_id) => {
  return `<div>
    <div style="padding: 15px 30px; width: 100%; background-color: #cc1616; color: #fff;">
      <h1>Verify Your Email</h2>
    </div>
    <br/>
    <br/>
    <br/>
      <b>&nbsp; You are very near to create your account on Eagle Stiches</b>
      <br/>
      <br/>
      &nbsp; <a href="${process.env.PROD_FRONT_URL}/passwordverification/${user_id}" target="_blank">
        <input type="button" style="cursor:pointer;box-shadow: 0 0px 5px 0 rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.19);border-radius: 4px;font-size: 22px;font-weight: bold;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px; background-color: #cc1616;" value="Verify Email" />
      </a>
      </form>
    <br/>
    <br/>
    <br/>
    <h5>After manual verification your account will be activated and you will be notified on this Email</h5>
    <div style="padding: 3px 30px; width: 100%; background-color: #cc1616; color: #fff;">
      <p>Best Regards from Eagle Stiches</p>
    </div>
    <div>`;
};

module.exports = verificationEmail;
