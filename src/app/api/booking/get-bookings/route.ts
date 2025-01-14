// @ts-nocheck
import { NextResponse } from "next/server";
import { prisma } from '@/lib';

export async function POST(request: Request){
    try {
        const {userId} = await request.json();
        const bookings = await prisma.bookings.findMany({
            where: {userId},
        });

        for(const booking of bookings){
            delete booking.paymentIntent;
            switch(booking.bookingType) {
                case "trips":
                    const trip = await prisma.trips.findUnique({
                        where: {id: booking.bookingTypeId},
                    });
                    booking.name = trip ? trip.name : null;
                    break;
                default :
                    booking.name = null;
            }
        }

        return NextResponse.json(
            {bookings}, 
            {status: 200}
        );

    }catch(error){
        return NextResponse.json({message: "An unexpected error occured."}, {status: 500})
    }
}