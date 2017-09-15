const guangfa = require("./config/guangfa")
const zhongrong = require("./config/zhongrong")

module.exports = (store) => {
    return {
        "guangfa": guangfa(store),
        "zhongrong":zhongrong(store)
    };
};