"use client";

import React from 'react';
import { Button, Link, NavbarBrand, NavbarContent, NavbarItem, Navbar as NextNavbar } from '@nextui-org/react';
import { Architects_Daughter } from 'next/font/google';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/store';
import Image from 'next/image';

const architectsDaughter = Architects_Daughter({
    weight: "400",
    style: "normal",
    subsets: ["latin"],
})


const Navbar = () => {

    const router = useRouter();
    const { userInfo } = useAppStore();
    const pathname = usePathname();
    const routesWithImages = ["/", "/search-flights", "/search-hotels"];

  return (
    <NextNavbar isBordered className='min-h-[10vh] bg-violet-500 bg-opacity-10 text-white relative'>
        {
            !routesWithImages.includes(pathname) && (
                <>
                <div className='fixed left-0 top-0 h-[10vh] w-[100vw] overflow-hidden z-0'>
                    <div className='h-[70vh] w-[100vw] absolute z-10 top-0 left-0'>
                        <Image src="/home/home-bg.png" layout='fill' objectFit="cover" alt='Search' />
                    </div>
                </div>
                <div 
                    className='fixed left-0 top-0 h-[10vh] w-[100vw] overflow-hidden z-0'
                    style={{
                        backdropFilter: "blur(12px) saturate(280%)",
                        WebkitBackdropFilter: "blur(12px) saturate(280%)",
                    }}
                ></div>
                </>
            )
        }
        <div className='z-10 w-full flex items-center'>
            <NavbarBrand>
                <div className='cursor-pointer flex items-center'>
                    <Image src={"/logo.png"} alt='logo' height={80} width={80} />
                    <span className="text-xl uppercase font-medium italic">
                        <span className={architectsDaughter.className}>GLOBETROTTER</span>
                    </span>
                </div>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem>
                <Link href="/" className={`${pathname === "/" ? "text-danger-500" : "text-white"}`}>
                    Tours
                </Link>
                </NavbarItem>
                <NavbarItem isActive>
                <Link 
                    // aria-current="page" 
                    href="/search-flights" 
                    className={`${pathname === "/search-flights" ? "text-danger-500" : "text-white"}`}
                >
                    Flights
                </Link>
                </NavbarItem>
                <NavbarItem>
                <Link href="/search-hotels" className={`${pathname === "/search-hotels" ? "text-danger-500" : "text-white"}`}>
                    Hotels
                </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Button 
                        color='secondary' 
                        variant='flat' 
                        className='text-purple-500 font-semibold'
                    >
                        Login
                    </Button>
                </NavbarItem>
                <NavbarItem>
                <Button color="danger" variant="flat" className='text-red-500 font-semibold'>
                    Sign Up
                </Button>
                </NavbarItem>
            </NavbarContent>

        </div>
    </NextNavbar>
  )
}

export default Navbar