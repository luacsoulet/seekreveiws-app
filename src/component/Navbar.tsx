"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { LogIn, LogOut, Home, BookOpenText, Film, User } from "lucide-react";

export const NavBar = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { isAuthenticated, logout, login } = useAuthStore();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY <= 300) {
                setIsVisible(true);
            } else if (currentScrollY < lastScrollY) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY) {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <div className={`navbar flex justify-between items-center p-4 w-[calc(100%-40px)] shadow-lg mb-4 fixed top-2 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-lg ${isVisible ? 'translate-y-0' : '-translate-y-[200%]'
            }`}>
            <div>
                <Link href="/" className="flex text-2xl backdrop-blur-sm p-4 rounded-full hover:scale-110 hover:text-bold active:scale-95 transition-all duration-300">SeekReviews</Link>
            </div>
            <div className="flex gap-2 items-center">
                <ul className="flex bg-gray-500/10 backdrop-blur-sm rounded-full overflow-hidden">
                    <li><Link className="btn btn-ghost rounded-lg flex items-center gap-2 p-4 hover:bg-gray-500/40 hover:scale-105 active:scale-95 transition-all duration-300" href="/">Home <Home /></Link></li>
                    <li><Link className="btn btn-ghost rounded-lg flex gap-2 p-4 hover:bg-gray-500/20 hover:scale-105 active:scale-95 transition-all duration-300" href="#Portfolio-section">Movies <Film /></Link></li>
                    <li><Link className="btn btn-ghost rounded-lg flex gap-2 p-4 hover:bg-gray-500/20 hover:scale-105 active:scale-95 transition-all duration-300" href="#About-section">Books <BookOpenText /></Link></li>
                </ul>
                {isAuthenticated ? (
                    <Link className="btn btn-ghost border-2 border-secondary rounded-full flex gap-2 p-4 hover:bg-secondary hover:text-black text-bold hover:scale-105 active:scale-95 transition-all duration-300" href="#About-section">My Account <User /></Link>
                ) : (
                    <Link className="btn btn-ghost border-2 border-secondary rounded-full flex gap-2 p-4 hover:bg-secondary hover:text-black text-bold hover:scale-105 active:scale-95 transition-all duration-300" href="#About-section">Login <LogIn /></Link>
                )}
            </div>
        </div>
    )
}