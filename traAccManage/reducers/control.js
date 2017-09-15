/**
 * Created by renren on 2017/6/14.
 */

module.exports = (state = {}, action) => {
    if (/CONTROL_*/.test(action.type)){
        const keyName = action.type.replace(/CONTROL_*/, "");
        const newState = { ...state };
        return {
            ...state,
            [keyName]: action.data
        };
    }
    return state;
};