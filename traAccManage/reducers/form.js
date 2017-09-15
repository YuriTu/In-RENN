/**
 * Created by renren on 2017/6/8.
 */

module.exports = (state = {}, action) => {
    switch (true) {
        case /DEFAULT_FORM_*/.test(action.type):{
            const keyName = action.type.replace(/DEFAULT_FORM_*/, "");
            const newState = { ...state };
            return {
                ...state,
                [keyName]: action.data
            };
        }

        case /CHANGE_FORM_*/.test(action.type):
            const keyName = action.type.replace("CHANGE_FORM_", "");
            const newState = { ...state };
            newState[keyName] = action.data;
            return newState;
        case /^ERROR/.test(action.type):
            const field = action.type.replace("ERROR_", "");
            const ns = { ...state };
            ns[`error_${field}`] = action.value;
            return ns;
        case /^CLEAR_ERROR/.test(action.type):
            const clearField = action.type.replace("CLEAR_ERROR_", "");
            const clearNs = { ...state };
            clearNs[`error_${clearField}`] = false;
            return clearNs;
        case /^CLAEAR_FORM/.test(action.type):
            const newClearState = {
                FUND_redeem_availableAmount : state.FUND_redeem_availableAmount,
                FUND_trans_availableAmount  : state.FUND_trans_availableAmount,
            };
            return newClearState;
        default:
            return state;
    }
};