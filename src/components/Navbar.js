"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { ChevronDown, ChevronUp, Home, User, FileText, Archive, Phone, HelpCircle, Users, DollarSign, Globe } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-green-600 text-white shadow-lg">
      <nav className="mx-5 flex max-w-7xl items-center justify-between px-2  py-4  sm:px-6">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">TS</span>
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-white">
                TECHNOSCHOLARS
              </div>
              <div className="text-xs text-green-100 -mt-1">
                International Research Journal
              </div>
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          aria-label="Toggle menu"
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-white hover:bg-green-700"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            className="h-6 w-6 text-white"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          <NavLinks />
          <AuthButtons session={session} />
        </div>
      </nav>

      {/* Mobile Navigation */}
      {open ? (
        <div className="lg:hidden border-t border-green-500 bg-green-700 text-white">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-3">
            <NavLinks mobile onClick={() => setOpen(false)} />
            <div className="border-t border-green-600 pt-3">
              <AuthButtons
                session={session}
                mobile
                onAction={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function NavLinks({ onClick, mobile }) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [authorOpen, setAuthorOpen] = useState(false);
  const [archivesOpen, setArchivesOpen] = useState(false);

  // Close all dropdowns when clicking a link
  const handleLinkClick = () => {
    setAboutOpen(false);
    setAuthorOpen(false);
    setArchivesOpen(false);
    if (onClick) onClick();
  };

  const NavItem = ({ children, className = "" }) => (
    <div className={`${mobile ? 'w-full' : ''} ${className}`}>
      {children}
    </div>
  );

  const NavLink = ({ href, children, icon: Icon, className = "" }) => (
    <Link
      href={href}
      onClick={handleLinkClick}
      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:text-green-200 hover:bg-green-700 rounded-md transition-all duration-200 ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </Link>
  );

  const DropdownButton = ({ children, isOpen, onClick, icon: Icon }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white hover:text-green-200 hover:bg-green-700 rounded-md transition-all duration-200 w-full justify-between lg:w-auto lg:justify-start"
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} />}
        {children}
      </div>
      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
    </button>
  );

  const DropdownMenu = ({ children, isOpen }) => (
    <>
      {isOpen && (
        <div className={`${mobile 
          ? 'pl-4 mt-2 space-y-1' 
          : 'absolute left-0 top-full mt-1 bg-white text-gray-800 shadow-lg rounded-md min-w-[14rem] py-2 z-50'
        }`}>
          {children}
        </div>
      )}
    </>
  );

  const DropdownLink = ({ href, children, className = "" }) => (
    <Link
      href={href}
      className={`block px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${mobile ? 'text-green-100 hover:bg-green-600 hover:text-white' : 'text-gray-700 hover:text-gray-900'} ${className}`}
      onClick={handleLinkClick}
    >
      {children}
    </Link>
  );

  return (
    <div className={`flex ${mobile ? 'flex-col space-y-2' : 'items-center gap-1'}`}>
      {/* Home */}
      <NavItem>
        <NavLink className ="mx-5" href="/" icon={Home}>
          Home
        </NavLink>
      </NavItem>

      {/* About Dropdown */}
      <NavItem className="relative">
        <DropdownButton
          isOpen={aboutOpen}
          onClick={() => setAboutOpen(!aboutOpen)}
          icon={Globe}
        >
          About
        </DropdownButton>
        <DropdownMenu isOpen={aboutOpen}>
          <DropdownLink href="/about">About Journal</DropdownLink>
          <DropdownLink href="/aims-scope">Aims & Scope</DropdownLink>
          <DropdownLink href="/ethics">Publication Ethics</DropdownLink>
          <DropdownLink href="/peer-review">Peer Review Process</DropdownLink>
          <DropdownLink href="/indexing">Indexing & Abstracting</DropdownLink>
          <DropdownLink href="/copyright">Copyright Policy</DropdownLink>
        </DropdownMenu>
      </NavItem>

      {/* Author Dropdown */}
      <NavItem className="relative">
        <DropdownButton
          isOpen={authorOpen}
          onClick={() => setAuthorOpen(!authorOpen)}
          icon={User}
        >
          Author
        </DropdownButton>
        <DropdownMenu isOpen={authorOpen}>
          <DropdownLink href="/submit">Submit Paper Online</DropdownLink>
          <DropdownLink href="/guidelines">Author Guidelines</DropdownLink>
          <DropdownLink href="/check-status">Track Paper Status</DropdownLink>
          <DropdownLink href="/paper-format">Paper Format</DropdownLink>
          <DropdownLink href="/copyright-form">Copyright Form</DropdownLink>
          <DropdownLink href="/certificates">Publication Certificate</DropdownLink>
          <DropdownLink href="/publication-fee">Publication Fee</DropdownLink>
        </DropdownMenu>
      </NavItem>

      {/* Indexing */}
      <NavItem>
        <NavLink href="/indexing" icon={FileText}>
          Indexing
        </NavLink>
      </NavItem>

      {/* Fee */}
      <NavItem>
        <NavLink href="/publication-fee" icon={DollarSign}>
          Fee
        </NavLink>
      </NavItem>

      {/* Archives Dropdown */}
      <NavItem className="relative">
        <DropdownButton
          isOpen={archivesOpen}
          onClick={() => setArchivesOpen(!archivesOpen)}
          icon={Archive}
        >
          Archives
        </DropdownButton>
        <DropdownMenu isOpen={archivesOpen}>
          <DropdownLink href="/current-issue">Current Issue</DropdownLink>
          <DropdownLink href="/archives">Past Issues</DropdownLink>
          <DropdownLink href="/call-for-papers">Call for Papers</DropdownLink>
        </DropdownMenu>
      </NavItem>

      {/* Conference */}
      <NavItem>
        <NavLink href="/conference" icon={Users}>
          Conference
        </NavLink>
      </NavItem>

      {/* FAQ */}
      <NavItem>
        <NavLink href="/faq" icon={HelpCircle}>
          FAQ
        </NavLink>
      </NavItem>

      {/* Contact */}
      <NavItem>
        <NavLink href="/contact" icon={Phone}>
          Contact
        </NavLink>
      </NavItem>
    </div>
  );
}

function AuthButtons({ session, mobile, onAction }) {
  if (session?.user) {
    return (
      <div className={`flex ${mobile ? 'flex-col gap-2' : 'items-center gap-3'}`}>
        <Link
          onClick={onAction}
          href="/dashboard"
          className=" mx-3 inline-flex items-center rounded-lg bg-white hover:bg-gray-100 px-4 py-2 text-sm font-medium text-green-700 transition-colors shadow-sm"
        >
          Dashboard
        </Link>
        {session.user.role === "editor" || session.user.role === "admin" ? (
          <Link
            onClick={onAction}
            href="/editor"
            className="inline-flex items-center rounded-lg border border-green-400 hover:bg-green-500 px-3 py-2 text-sm font-medium text-white transition-colors"
          >
            Editor
          </Link>
        ) : null}
        {session.user.role === "reviewer" ? (
          <Link
            onClick={onAction}
            href="/reviewer"
            className="inline-flex items-center rounded-lg border border-green-400 hover:bg-green-500 px-3 py-2 text-sm font-medium text-white transition-colors"
          >
            Reviewer
          </Link>
        ) : null}
        {session.user.role === "admin" ? (
          <Link
            onClick={onAction}
            href="/admin"
            className="inline-flex items-center rounded-lg border border-green-400 hover:bg-green-500 px-3 py-2 text-sm font-medium text-white transition-colors"
          >
            Admin
          </Link>
        ) : null}
        <button
          onClick={() => {
            signOut();
            onAction && onAction();
          }}
          className="inline-flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors shadow-sm min-w-[100px]"
        >
          Sign Out
        </button>
      </div>
    );
  }
  
  return (
    <div className={`flex ${mobile ? 'flex-col gap-2' : 'items-center gap-3'}`}>
      <Link
        onClick={onAction}
        href="/login"
        className="inline-flex items-center rounded-lg border border-green-400 hover:bg-green-500 px-4 py-2 text-sm font-medium text-white transition-colors"
      >
        Login
      </Link>
      <Link
        onClick={onAction}
        href="/register"
        className="inline-flex items-center rounded-lg bg-white hover:bg-gray-100 px-4 py-2 text-sm font-medium text-green-700 transition-colors shadow-sm"
      >
        Register
      </Link>
    </div>
  );
}