/**
 * Created by Yuri on 16/11/15.
 */

const getBasicInfoData = (state = {}, action) => {
    switch (action.type) {
        case "GET_BASIC_INFO":
            return {
                ...state,
                basicInfoData: {
                    ...action.basicInfoData,
                    // strategyInfo: {
                    //     ...action.basicInfoData.strategyInfo,
                    //     description: "一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十",
                    //
                    // },
                },
            };
        // case "IS_TEDIOUS":
        //     if (action.height <= 50){
        //         return {
        //             ...state,
        //             basicInfoData: {
        //                 ...state.basicInfoData,
        //                 needIcon: false,
        //             },
        //         };
        //     }
        //     return {
        //         ...state,
        //         basicInfoData: {
        //             ...state.basicInfoData,
        //             needIcon: true,
        //         },
        //     };
        case "TOGGLE_TEXT":
            const temp = state.basicInfoData;
            return {
                ...state,
                basicInfoData: {
                    ...temp,
                    showMore: !temp.showMore,
                },
            };
        default:
            return {
                ...state
            };
    }

};

module.exports = getBasicInfoData;
