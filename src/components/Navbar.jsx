import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Droplets } from 'lucide-react';
import clsx from 'clsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Technology', path: '/technology' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="fixed w-full z-50 bg-white shadow-sm border-b border-slate-100 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Droplets className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl text-slate-900">
            AquaPure
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={clsx(
                'text-sm font-medium transition-colors',
                location.pathname === link.path 
                  ? 'text-primary font-bold' 
                  : 'text-slate-700 hover:text-primary'
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/contact"
            className="ml-4 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-md font-semibold transition-colors shadow-sm"
          >
            Buy Now
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-slate-100 py-4 px-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={clsx(
                'text-base font-medium px-2 py-1 rounded-md',
                location.pathname === link.path ? 'bg-primary-light text-primary' : 'text-slate-700'
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="mt-2 bg-accent text-white text-center px-5 py-3 rounded-md font-semibold"
          >
            Buy Now
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
