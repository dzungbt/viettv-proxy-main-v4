
require("dotenv").config();
const Transporter = require('./setup');

const copyrightWarning = (userData) => {
  let mailData = {
    from: process.env.EMAIL_USER,  // sender address
    to: userData.email,   // list of receivers
    subject: 'Thông báo vi phạm quy định sử dụng',
    text: 'That was easy!',
    // html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
    html: `<html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #EDF2F7;
              display:flex;
              justify-content:center;
              flex-warp:wrap;

            }
            
            .mail-main{
              background-color:#EDF2F7;
              flex-warp:wrap;

              width : 100%;
              height:auto;
            }

            .mail-header{
              width : 100%;
            }

            .mail-header h5{
              text-align:center;
              font-size:25px;
              font-weight:bold;
              color : #05234D;
            }

            .mail-inner{
              flex-warp:wrap;
              background-color:white;
              margin : 20px 0%;
              height:auto;
              padding : 20px;
            }

            .mail-inner-row{
              width:100%;
              margin : 10px;
            }

            .mail-inner-greeting{
              font-size:20px;
              font-weight:bold;
              text-align:center
            }

            .mail-inner-main-text{
              font-size:15px;

            }

            .mail-inner-main-request-code{
              font-size:18px;
              font-weight:bold;
            }

            .mail-inner-access-btn-sec{
              display:flex;
              justify-content: center;
            }

            .mail-inner-access-btn{
              font-size : 15px;
              font-weight:bold;
              width:50%;
              margin : 0px 25%;
              color:white;
              text-decoration: none;
              text-align:center;
            }
          </style>
        </head>
        <body>
         <div class="mail-main">
          <div class="mail-header">
            <h5>VIET-TV</h5>
          </div>
          <div class="mail-inner">
            <div class="mail-inner-row">
              <p class = "mail-inner-greeting">Thông báo phát hiện truy cập bất thường</p>
            </div>
            <div class="mail-inner-row">
              <p class = "mail-inner-main-text">Xin chào!</p>
            </div>
            <div class="mail-inner-row">
              <p class = "mail-inner-main-text">Hệ thống của chúng tôi ghi nhận rằng tài khoản ${userData.username} của bạn đang được truy cập từ nhiều thiết bị khác nhau. </p>
            </div>
            <div class="mail-inner-row">
              <p class = "mail-inner-main-text">*) Lưu ý : Link truyền hình của một tài khoản chỉ có thể được xem từ một thiết bị duy nhất.</p>
            </div>
            <div class="mail-inner-row">
              <p class = "mail-inner-main-text">Đây là cảnh báo lần ${userData.warningTime}. Nếu vi phạm chính sách sử dụng quá 3 lần, tài khoản của bạn sẽ bị khóa.</p>
            </div>
            <div class="mail-inner-row">
              <p class = "mail-inner-main-text">Mọi thắc mắc xin hãy liên lạc với bộ phận chăm sóc khách hàng của chúng tôi!</p>
            </div>
            <div class="mail-inner-row">
              <div class = "mail-inner-access-btn-sec"> 
                <a class = "mail-inner-access-btn" href="#">Truy cập trang web của chúng tôi</a>
              </div>
            </div>
            <hr>
            <div class="mail-inner-row">
              <p>Xin cảm ơn,</p>
              <p>VIET-TV.VN</p>
            </div>

          </div>
         </div>
        </body>
      </html>`,
  }

  Transporter.sendMail(mailData, function (err, info) {
    if (err)
      return false;

    customElements
    return true;
  });
}

const copyrightBlock = (userData) => {
  console.log('--------------> copyrightBlock----------------->');
  console.log('from : ', process.env.EMAIL_USER, ' - to : ', userData.email, ' - username : ', userData.username);
  let mailData = {
    from: process.env.EMAIL_USER,  // sender address
    to: userData.email,   // list of receivers
    subject: 'Thông báo tài khoản bị đình chỉ',
    text: 'That was easy!',
    // html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
    html: `<html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #EDF2F7;
              display:flex;
              justify-content:center;
              flex-warp:wrap;

            }
            
            .mail-main{
              background-color:#EDF2F7;
              flex-warp:wrap;

              width : 100%;
              height:auto;
            }

            .mail-header{
              width : 100%;
            }

            .mail-header h5{
              text-align:center;
              font-size:25px;
              font-weight:bold;
              color : #05234D;
            }

            .mail-inner{
              flex-warp:wrap;
              background-color:white;
              margin : 20px 0%;
              height:auto;
              padding : 20px;
            }

            .mail-inner-row{
              width:100%;
              margin : 10px;
            }

            .mail-inner-greeting{
              font-size:20px;
              font-weight:bold;
              text-align:center
            }

            .mail-inner-main-text{
              font-size:15px;

            }

            .mail-inner-main-request-code{
              font-size:18px;
              font-weight:bold;
            }

            .mail-inner-access-btn-sec{
              display:flex;
              justify-content: center;
            }

            .mail-inner-access-btn{
              font-size : 15px;
              font-weight:bold;
              width:50%;
              margin : 0px 25%;
              color:white;
              text-decoration: none;
              text-align:center;
            }
          </style>
        </head>
        <body>
         <div class="mail-main">
          <div class="mail-header">
            <h5>VIET-TV</h5>
          </div>
          <div class="mail-inner">
            <div class="mail-inner-row">
              <p class = "mail-inner-greeting">Thông báo đình chỉ tài khoản</p>
            </div>
            <div class="mail-inner-row">
              <p class = "mail-inner-main-text">Xin chào!</p>
            </div>
            <div class="mail-inner-row">
              <p class = "mail-inner-main-text">Hệ thống của chúng tôi ghi nhận rằng tài khoản ${userData.username} của bạn đang được truy cập từ nhiều thiết bị khác nhau. Số lần truy cập trái phép của bạn đã vượt quá 3 lần. Chúng tôi sẽ tiền hành đình chỉ tài khoản của bạn </p>
            </div>
            <div class="mail-inner-row">
              <p class = "mail-inner-main-text">*) Lưu ý : Link truyền hình của một tài khoản chỉ có thể được xem từ một thiết bị duy nhất.</p>
            </div>
            <div class="mail-inner-row">
              <p class = "mail-inner-main-text">Đây là một thông báo.</p>
            </div>
            <div class="mail-inner-row">
              <p class = "mail-inner-main-text">Mọi yêu cầu kháng nghị hoặc thắc mắc xin hãy liên lạc với bộ phận chăm sóc khách hàng của chúng tôi!</p>
            </div>
            <div class="mail-inner-row">
              <div class = "mail-inner-access-btn-sec"> 
                <a class = "mail-inner-access-btn" href="#">Truy cập trang web của chúng tôi</a>
              </div>
            </div>
            <hr>
            <div class="mail-inner-row">
              <p>Xin cảm ơn,</p>
              <p>VIET-TV.VN</p>
            </div>

          </div>
         </div>
        </body>
      </html>`,
  }

  Transporter.sendMail(mailData, function (err, info) {
    if (err)
      return false;

    else
      return true;
  });
}

module.exports = {
  copyrightWarning: copyrightWarning,
  copyrightBlock: copyrightBlock,
}