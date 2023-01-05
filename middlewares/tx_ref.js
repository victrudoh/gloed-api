const moment = require("moment");

var moment1 = require("moment-timezone");

//generate random IDs for flutterwave tx_ref
let tx_ref = 0;

const get_Tx_Ref = () => {
    const time2 = moment1().tz("Africa/Lagos").format("YYYY-MM-DD HH:mm:SS");
    const time3 = time2.replace(/[\-]|[\s]|[\:]/g, "");
    // console.log("time: ", time3);
    tx_ref = time3;

    return tx_ref;
};

module.exports = {
    get_Tx_Ref,
    tx_ref,
};