require("dotenv").config();
var request = require('request');
function suspendUserCauseViolationCopyRight(userid) {
    let url = process.env.VIET_TV_SERVER_URL + '/tv/copyright-violation-blocked';
    request.post(
        url,
        { json: { id: userid } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
            console.log('error : ', error);
            // console.log('response : ', response);
            console.log('body : ', body);

        }
    );
}

module.exports = {
    suspendUserCauseViolationCopyRight: suspendUserCauseViolationCopyRight,
}