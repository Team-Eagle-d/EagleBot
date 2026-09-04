export function calcPerformance<TResult, TArgs extends unknown[]>(
    func:(...args:TArgs) => TResult,
    ...args:TArgs
):{
    readonly result:TResult,
    readonly performance:number
} {
    const start = Date.now();

    const result = func(...args);

    const end = Date.now();

    return {
        result,
        performance: end - start
    };
}