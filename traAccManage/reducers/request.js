/**
 * Created by Yuri on 2017/6/5.
 */

module.exports = (state = {}, action) => {
    if (/REQUEST_*/.test(action.type)){
        const keyName = action.type.replace(/REQUEST_*/, "");
        const newState = { ...state };
        return {
            ...state,
            [keyName]: action.data
        };
        // newState[keyName] = action.data;
        // return newState;

    }
    return state;
};