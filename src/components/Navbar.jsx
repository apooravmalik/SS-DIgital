import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Add smooth scrolling behavior to the document
    document.documentElement.style.scrollBehavior = 'smooth';

    // Cleanup function to remove the style when component unmounts
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false); // Close mobile menu after clicking
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">SS Digital</div>
        <div className="hidden md:flex space-x-4">
          <a href="#features" onClick={(e) => handleScroll(e, '#features')} className="hover:text-blue-200 font-semibold p-2">What we do</a>
          <a href="#contact" onClick={(e) => handleScroll(e, '#contact')} className="hover:text-blue-200 font-semibold p-2">Contact us</a>
          <Link to="/login" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-400 text-xl">
            Login
          </Link>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          Menu
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden mt-2">
          <a href="#features" onClick={(e) => handleScroll(e, '#features')} className="block py-2 hover:text-blue-200">What we do</a>
          <a href="#contact" onClick={(e) => handleScroll(e, '#contact')} className="block py-2 hover:text-blue-200">Contact us</a>
          <Link to="/" className="block w-full text-left bg-blue-500 px-4 py-2 rounded hover:bg-blue-400 mt-2">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;