
/**
 * 生成一组平滑的随机数，根据数量，将随机数均匀的分布
 * @param {String} count 需要生成几个数据
 * @param {Number} bits 需要保留几位小数
 * @returns {Array} 对应的数组
 */
const smoothRandom = (count, bits) => {
    let num = parseInt(count);
    const rs = [];
    if ( isNaN(num) || (typeof num !== "number")){
        num = 1;
    }
    const step = 1 / num ;
    let i = 1;
    while (i <= num){
        const number = Math.random() * step * i;
        const flag = number > (step * (i - 1)) && number < (step * (i + 1));
        if (flag){
            rs.push(+number.toFixed(bits));
            i++;
        }
    }
    return rs;
};




const createRandomList = (count, probability) => {
    let rs = [];
    // 生成的位置百分比保留两位
    const randomBit = 2;
    // 在70%的概率下上成1-5条线  每条线给出 百分比
    const hasBreakPoints = Math.random() < probability;
    // 需要多少个break  因为是0-1的小数
    const breakCount = count;
    if (hasBreakPoints){
        // 成1-5条线
        const breakPointsLength = Math.ceil((Math.random() % (breakCount / 10) ) * 10);
        // 获得每条线的对应百分比
        rs = smoothRandom(breakPointsLength, randomBit);
    }
    return rs;
};


const createBasicHalo = (config, breakPoints, strList) => {
    // 矩形上边 半径
    // 说白了是一段圆弧，其半径为topoffset
    const topMid = {
        x : config.position.x,
        y : config.position.y + config.topOffset,
    };
    const botMid = {
        x : config.position.x,
        y : config.position.y + config.botOffset,
    };
    const marginTop = Math.tan(config.radius) * config.topOffset;
    const marginBottom = Math.tan(config.radius) * config.botOffset;
    const stepMargin = config.break.stepMargin || 0.025;
    const haloLength = config.botOffset - config.topOffset;


    // debugger
    const formate = (list) => {
        const rs = [];
        for (let i = 0;i < list.length;i++){
            let step = +list[i];
            // 对开头结尾太靠近的处理
            if (step < 0.05){
                step = 0.05;
            } else if ( step > 0.95){
                step = 0.95;
            }
            const nextStep = step + stepMargin;
            rs.push({
                // 左下 || stripe 左上
                stepLB: {
                    x : topMid.x - step * marginBottom,
                    y : topMid.y + step * haloLength
                },
                // 右下 || stripe 右上
                stepRB: {
                    x : topMid.x + step * marginBottom,
                    y : topMid.y + step * haloLength
                },
                // 右上 || stripe 右下
                stepRT: {
                    x : topMid.x + nextStep * marginBottom,
                    y : topMid.y + nextStep * haloLength
                },
                // 左上 || stripe 左下
                stepLT: {
                    x : topMid.x - nextStep * marginBottom,
                    y : topMid.y + nextStep * haloLength
                }
            });
        }
        return rs;
    };

    // 开头和结尾是一样的
    return {
        // 开始右上
        initRT: {
            x : topMid.x + marginTop,
            y : topMid.y
        },
        // 开始左上
        initLT: {
            x : topMid.x - marginTop,
            y : topMid.y,
        },
        // 左下
        initLB: {
            x : botMid.x - marginBottom,
            y : botMid.y
        },
        // 右下
        initRB: {
            x : botMid.x + marginBottom,
            y : botMid.y
        },
        breakPointsList : formate(breakPoints),
        stripeList      : formate(strList),
    };
};

// breakPointsList, stripeList
const init = () => {
    onmessage = (evt) => {
        const origin = evt.data.conf;
        const rs = {
            halo: [],
        };


        for (let i = 0;i < origin.haloCount;i++){
            rs.halo.push(
                createBasicHalo(origin,
                    createRandomList(origin.break.count, origin.break.pro),
                    createRandomList(origin.stripe.count, origin.stripe.pro)
                )
            );
        }
        postMessage(rs);
    };
};



init();