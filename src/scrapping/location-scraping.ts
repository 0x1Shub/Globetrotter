import { Page } from 'puppeteer';

interface PackageInfo {
    id: string | null;
    name: string;
}

export const startLocationScraping = async (page: Page): Promise<PackageInfo[]> => {
    return "";
}