const requiredXpMap:Map<number, bigint> = new Map();
/**
 * 레벨에 따른 필요 경험치 양을 가져옵니다.
 * 이미 계산한 것은 캐싱합니다.
 */
export function getLevelUpRequiredXp(curLevel:number) {
    if(requiredXpMap.has(curLevel)) {
        return requiredXpMap.get(curLevel)!
    }

    requiredXpMap.set(curLevel, _calcLevelUpRequiredXp(curLevel));

    return requiredXpMap.get(curLevel)!
}

const XP_BASE = 100;
const XP_BASE_POWER = 1.05;

const DAMPING_LEVEL = 5; // 5레벨부터 감쇠 적용
const DAMPING_POWER = 1.05;

// 레벨에 따른 필요 경험치 양의 수식은 다음과 같습니다.
// 100^{1.05^L} & L < \text{damping_level} \\
// \frac{100^{1.05^L}}{(\frac{\log_2 L}{\log_2 \text{damping_level}})^{1.05^L}} & L \ge \text{damping_level}
function _calcLevelUpRequiredXp(curLevel:number):bigint {
    if(curLevel < DAMPING_LEVEL) {
        return BigInt(
            Math.floor(XP_BASE ** XP_BASE_POWER ** curLevel)
        );
    }
    
    return BigInt(
        Math.floor(((XP_BASE ** XP_BASE_POWER ** curLevel)
        / (Math.log2(curLevel) / Math.log2(DAMPING_LEVEL)) ** DAMPING_POWER ** curLevel))
    );
}

/**
 * true: 레벨업 가능 시, false: 레벨업 불가능 시
 */
export function checkLevelUp(curLevel:number, curXp:bigint):boolean {
    return curXp >= getLevelUpRequiredXp(curLevel);
}

type _LevelUpData = {
    calcLevel:number,
    calcIncrementLevel:number,
    calcXp:bigint
};

/**
 * 반복해서 레벨업할 수 있는지 체크 후 레벨업 관련 데이터를 반환합니다.
 */
export function calcLevelUpData(curLevel:number, curXp:bigint, gainXp:bigint):_LevelUpData {
    let level = curLevel;
    let xp = curXp + gainXp;

    while(checkLevelUp(level, xp)) {
        xp -= getLevelUpRequiredXp(level);
        level++;
    }

    return {
        calcLevel: level,
        calcIncrementLevel: level - curLevel,
        calcXp: xp
    };
}

const XP_GAIN = 50;
const XP_GAIN_MULT = 2 ** -5;
const XP_GAIN_MAX = XP_GAIN * 2; 
export function getXpGain(attendanceStreak:number):bigint {
    return BigInt(Math.floor(Math.min(
        Math.max(
            XP_GAIN * (
                1 + XP_GAIN_MULT * (
                    attendanceStreak - 1
                )
            ),
            XP_GAIN
        ), 
        XP_GAIN_MAX
    )));
}