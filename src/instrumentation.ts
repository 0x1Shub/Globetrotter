import { join } from "path";
import { Browser } from 'puppeteer';
import { startLocationScraping } from "./scrapping";

export const register = async () => {
    if(process.env.NEXT_RUNTIME === "nodejs" ){
        const { Worker } = await import("bullmq");
        const { connection, jobsQueue, prisma } = await import('@/lib');
        const puppeteer = await import("puppeteer");
        const SBR_WS_ENDPOINT = "wss://brd-customer-hl_f567f6a5-zone-globetrotter1:w1xxes7z345u@brd.superproxy.io:9222";

        new Worker("jobsQueue", async (job) => {
            let browser: undefined | Browser = undefined;
            try {
                browser = await puppeteer.connect({
                    browserWSEndpoint: SBR_WS_ENDPOINT,
                });

                const page = await browser?.newPage();
                console.log("before if", job.data);
                
                if(job.data.jobType.type === "location"){
                    console.log("Connected! Navigating to "+job.data.url);
                    await page?.goto(job.data.url, {timeout: 60000});
                    console.log("Navigated to scrapping content...");
                    const packages = await startLocationScraping(page); 
                    console.log({packages});
                }
    
            }catch(err){
                console.log(err);
                await prisma.jobs.update({
                    where: {id:job.data.id},        
                    data: {isComplete: true, status: "failed"}
                });
            }finally {
                await browser?.close();
                console.log("Browser closed successfully")
            }

            
        }, {
            connection,
            concurrency:10, 
            removeOnComplete: {count: 1000},
            removeOnFail: {count: 5000},
        });
    }
}

