"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Branches", href: "/ccodes" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="flex justify-between items-center height-10 w-full px-2 sm:px-16 py-4 bg-indigo-300 shadow-xl shadow-blue-500/10 sticky top-0 z-50">
      <aside className="flex gap-2 items-center">
        <Image
          src="/campuslogics.webp"
          width={150}
          height={150}
          alt="campus logics"
          className="w-[100px] sm:w-[150px] drop-shadow-xl"
        />
        <strong className="text-blue-600 text-[10px] sm:text-xs">
          {" | "}JOSAA
        </strong>
      </aside>

      {/* Desktop Nav */}
      <nav className="mx-4 hidden sm:block text-blue-500 font-bold">
        <ul className="flex items-center justify-between gap-12">
          {navLinks.map((link) => (
            <li className="relative group" key={link.href}>
              <Link href={link.href} className="block py-2 focus:outline-0">
                {link.name}
              </Link>
              <span className="absolute left-0 right-0 bottom-0 h-[2px] bg-blue-300 scale-x-0 group-hover:scale-x-100 transition-all duration-2000 ease-in-out"></span>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="sm:hidden flex items-center justify-center p-2 rounded focus:outline-none"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Open menu"
      >
        {/* Hamburger Icon */}
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-20 transition-opacity duration-300 ${
          menuOpen ? "block" : "hidden"
        } sm:hidden`}
        onClick={() => setMenuOpen(false)}
      ></div>
      <nav
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } sm:hidden`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <span className="text-blue-600 font-bold text-lg">Menu</span>
          <button
            className="p-2 rounded focus:outline-none"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            {/* Close Icon */}
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="flex flex-col gap-4 p-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block py-2 text-blue-600 hover:text-blue-800 font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;