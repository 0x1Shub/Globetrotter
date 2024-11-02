import { NextResponse } from "next/server";
import { prisma, jobsQueue } from '@/lib';

export async function POST(request: Request){
    try {
        const {url, jobType} = await request.json();
        const response = await prisma.jobs.create({data: {url, jobType}});
        await jobsQueue.add("new location", {url, jobType, id:response.id})

        return NextResponse.json({jobsCreated: true}, {status: 201});

    }catch (err){
        return NextResponse.json({message: "An unexpected error occured."}, {status: 500})
    }
}