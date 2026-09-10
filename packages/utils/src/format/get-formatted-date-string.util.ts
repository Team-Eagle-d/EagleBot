export function getFormattedDateString(standardTimeDate:Date, timeZone:string):`${string}-${string}-${string}` {
    // locale은 임의로 한국 기준으로 맞추었습니다.
    const parts = new Intl.DateTimeFormat("ko-KR", {
        timeZone: timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(standardTimeDate);

    const date = `${
        parts.find((v) => {
            return v.type === "year";
        })!.value
    }-${
        parts.find((v) => {
            return v.type === "month";
        })!.value
    }-${
        parts.find((v) => {
            return v.type === "day";
        })!.value
    }` as const;

    return date;
}