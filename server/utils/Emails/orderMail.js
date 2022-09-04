const orderMail = (order_number, design_name) => {
  return `<div style="padding: 0; margin: 0">
  <div style="padding: 10px; margin: 0; background: red; color: white; font-size: 16px">
    Order Confirmation
  </div>
  <div>Order Number for the Design Name order ${design_name} is <b>${order_number}</b></div> 
  <div>Price of this order will be recieved via Email once your order is reviewed and Accepted</div>
  <div>Contact the team on <b>+92-332-231-8067</b>, for any inconvenience.</div>
  <div>Thank you for choosing Eagle Stiches</div>
  `;
};

module.exports = orderMail;
