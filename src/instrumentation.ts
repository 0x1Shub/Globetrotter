import { join } from "path";

export const register = async () => {
    if(typeof window === "undefined" && process.env.NEXT_RUNTIME === "nodejs" ){
        const { Worker } = await import("bullmq");
        const { connection } = await import('@/lib');

        new Worker("jobsQueue", async (job) => {
            console.log(job)
        }, {
            connection,
            concurrency:10, 
            removeOnComplete: {count: 1000},
            removeOnFail: {count: 5000},
        });
    }
}

