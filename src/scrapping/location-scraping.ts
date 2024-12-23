import { Page } from 'puppeteer';

interface PackageInfo {
    id: string | null;
    name: string;
}

export const startLocationScraping = async (page: Page): Promise<PackageInfo[]> => {
    return await page.evaluate(() => {
        const packageElements = document.querySelectorAll(".packages-container");
        const packages: PackageInfo[] = [];
        packageElements.forEach((packageElement) => {
            const packageInfo: PackageInfo = {
                id: null,
                name: ""
            };
            packageInfo.name = (packageElement.querySelector(".package-name a") as HTMLElement).textContent || ""
        })
        return packages;
    })
}