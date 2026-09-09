export async function calcPerformanceAsync<TResult, TArgs extends unknown[]>(
    asyncFunc:(...args:TArgs) => Promise<TResult>,
    ...args:TArgs
):Promise<{
    readonly result:TResult,
    readonly performance:number
}> {
    const start = Date.now();

    const result = await asyncFunc(...args);

    const end = Date.now();

    return {
        result,
        performance: end - start
    };
}