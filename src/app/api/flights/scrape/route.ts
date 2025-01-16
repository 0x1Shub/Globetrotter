import { NextResponse } from "next/server";
import { prisma, jobsQueue } from '@/lib';

export async function GET(request: Request){
    try {
        const { searchParams } = new URL(request.url);
        const source = searchParams.get("source");
        const destination = searchParams.get("destination");
        const date = searchParams.get("date");
        const url = `https://www.kayak.com/flights/${source}-${destination}/${date}/`
        const response = await prisma.jobs.create({data: {url, jobType: {type: "flight", source, destination, date}}});
        await jobsQueue.add("new location", {url, jobType: {type: "flight", source, destination, date}, id:response.id})

        return NextResponse.json({message: "Job Running", id: response.id}, {status: 201});

    }catch (err){
        return NextResponse.json({message: "An unexpected error occured."}, {status: 500})
    }
}