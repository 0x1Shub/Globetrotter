import { Browser } from 'puppeteer';
import { startLocationScraping, startPackageScraping } from "./scrapping";

export const register = async () => {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { Worker } = await import("bullmq");
        const { connection, jobsQueue, prisma } = await import('@/lib');
        const puppeteer = await import("puppeteer");
        const BROWSER_WS = "wss://brd-customer-hl_a1903688-zone-globetrotter:rwksgzg14dd5@brd.superproxy.io:9222";

        new Worker("jobsQueue", async (job) => {
            let browser: undefined | Browser = undefined;
            try {
                browser = await puppeteer.connect({
                    browserWSEndpoint: BROWSER_WS,
                });

                const page = await browser?.newPage();
                console.log("Browser connected and page created.");

                console.log("Connected! Navigating to " + job.data.url);
                await page?.goto(job.data.url, { timeout: 60000 });
                console.log("Navigated to scraping content...");
                if (job.data.jobType.type === "location") {
                    const packages = await startLocationScraping(page);
                    await prisma.jobs.update(
                        {where: 
                            {id: job.data.id}, 
                            data:{isComplete: true, status: "failed"}});
                    for(const pkg of packages){
                        const jobCreated = await prisma.jobs.findFirst({
                            where: {
                                url: `https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg.id}`,
                            },
                        });
                        if(!jobCreated){
                            const job = await prisma.jobs.create({
                                data: {
                                    url: `https://packages.yatra.com/holidays/intl/details.htm?packageId=${pkg.id}`,
                                    jobType: {type: "package"},
                                },
                            });
                            jobsQueue.add("package", {...job, packageDetails: pkg});
                        }
                    }
                }
                else if(job.data.jobType.type === "package"){
                    const alreadyScrape = await prisma.trips.findUnique({where: {id: job.data.packageDetails.id}});
                    if(!alreadyScrape){
                        const pkg = await startPackageScraping(page, job.data.packageDetails);
                        console.log(pkg);
                        // await prisma.trips.create({data: pkg});
                        // await prisma.jobs.update({
                        //     where: { id: job.data.id }, 
                        //     data:{ isComplete: true, status: "failed" }
                        // });
                    }



                }

            } catch (err) {
                console.error("Error connecting to browser or scraping:", err);
                await prisma.jobs.update({
                    where: { id: job.data.id },
                    data: { isComplete: true, status: "failed" }
                });
            } finally {
                if (browser) {
                    await browser.close();
                    console.log("Browser closed successfully");
                }
            }
        }, {
            connection,
            concurrency: 10,
            removeOnComplete: { count: 1000 },
            removeOnFail: { count: 5000 },
        });
    }
}
