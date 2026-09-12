// 기본적으로 시간, 분, 초는 출력 고정입니다.
// 일이 0이 아닐 경우 일을 합쳐 출력합니다.
// 년이 0이 아닐 경우 년을 합쳐 출력합니다.
// full string example: 1년 20일 20시간 10분 5초
export function getDuration(ms:number):string {
    const second = Math.floor(ms / 1000) % 60;

    const MINUTE_MULT = 1000 * 60;
    const minute = Math.floor(ms / MINUTE_MULT) % 60;
    
    const HOUR_MULT = MINUTE_MULT * 60;
    const hour = Math.floor(ms / HOUR_MULT) % 24;

    const DAY_MULT = HOUR_MULT * 24;
    const day = Math.floor(ms / DAY_MULT) % 365;

    const YEAR_MULT = DAY_MULT * 365;
    const year = Math.floor(ms / YEAR_MULT);

    let str = `${hour}시간 ${minute}분 ${second}초`;
    if(day != 0) {
        str = `${day}일 ${str}`;
    }
    if(year != 0) {
        str = `${year}년 ${str}`;
    }

    return str; 
}