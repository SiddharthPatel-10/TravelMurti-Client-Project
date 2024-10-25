import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [packages, setPackages] = useState([]);
  const [subPackages, setSubPackages] = useState({});
  const [isDropdownOpen, setDropdownOpen] = useState({});
  const [timeoutId, setTimeoutId] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/packages`
        );
        setPackages(response.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();

    // Add a listener for screen size changes
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check on initial load

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const fetchSubPackages = async (packageId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/subpackages/package/${packageId}`
      );
      setSubPackages((prevState) => ({
        ...prevState,
        [packageId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching sub-packages:", error);
    }
  };

  const handleMouseEnter = (pkgCategory, packageId) => {
    if (!isMobile) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setDropdownOpen((prevState) => ({
        ...prevState,
        [pkgCategory]: true,
      }));

      if (!subPackages[packageId]) {
        fetchSubPackages(packageId);
      }
    }
  };

  const handleMouseLeave = (pkgCategory) => {
    if (!isMobile) {
      const id = setTimeout(() => {
        setDropdownOpen((prevState) => ({
          ...prevState,
          [pkgCategory]: false,
        }));
      }, 200);

      setTimeoutId(id);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMobileDropdown = (pkgCategory, packageId) => {
    setMobileDropdownOpen((prevState) => ({
      ...prevState,
      [pkgCategory]: !prevState[pkgCategory],
    }));

    if (!subPackages[packageId]) {
      fetchSubPackages(packageId);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md mx-auto md:flex w-full max-w-8xl justify-between md:px-24 px-6 py-3 text-sm">
      {/* Left section */}
      <div className="flex justify-between items-center gap-10">
        <div className="flex items-center">
        <img
          className="h-8 w-auto"
          src="https://lh4.googleusercontent.com/-43TdC72iuWI/AAAAAAAAAAI/AAAAAAAAAAA/vLm5URYYrSY/s44-p-k-no-ns-nd/photo.jpg"
          alt="Company Logo"
          loading="lazy"
        />
        <p className="pl-4 text-base">Travel Murti</p>
        </div>
        {/* Mobile Menu Toggle */}
        <button
          className="block md:hidden text-3xl focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8">
        <Link to="/">
          <p className="pr-4">Home</p>
        </Link>
        <Link to="/about">
          <p>About Us</p>
          {/* <p className="pr-4">Home</p> */}
        </Link>
        {/* Dynamic Dropdown for Packages */}
        {packages.length > 0 &&
          packages.map((pkg) => (
            <div
              key={pkg._id}
              className="group relative px-2 py-3 transition-all z-10"
              onMouseLeave={() => handleMouseLeave(pkg.category)}
            >
              <p
                onMouseEnter={() => handleMouseEnter(pkg.category, pkg._id)}
                className="flex items-center gap-2 cursor-pointer text-black group-hover:text-neutral-400"
              >
                <span>{pkg.category}</span>
                <IoIosArrowDown className="rotate-180 transition-all group-hover:rotate-0" />
              </p>
              {/* Sub-package dropdown */}
              {isDropdownOpen[pkg.category] && subPackages[pkg._id] && (
                <div className="border absolute -right-16 top-10 w-auto flex-col gap-1 rounded-md bg-white py-3 shadow-sm opacity-100 transition-opacity">
                  {subPackages[pkg._id].length > 0 ? (
                    subPackages[pkg._id].map((subPkg) => (
                      <Link
                        to={`/subpackages/${subPkg._id}`} // Dynamic routing
                        key={subPkg._id}
                        className="block cursor-pointer items-center min-w-60 py-1 pl-8 pr-8 text-black hover:text-neutral-400"
                      >
                        {subPkg.name}
                      </Link>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-sm text-gray-500">
                      No sub-packages
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        <Link to="/contact">
          <p className="pr-4">Contact Us</p>
        </Link>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 mt-4 pl-2">
          <p>Home</p>
          <p>About Us</p>
          {packages.length > 0 &&
            packages.map((pkg) => (
              <div key={pkg._id}>
                <p
                  className="flex items-center justify-between"
                  onClick={() => toggleMobileDropdown(pkg.category, pkg._id)}
                >
                  <span>{pkg.category}</span>
                  <IoIosArrowDown
                    className={`transition-transform duration-300 ${
                      mobileDropdownOpen[pkg.category] ? "rotate-180" : ""
                    }`}
                  />
                </p>
                {mobileDropdownOpen[pkg.category] && subPackages[pkg._id] && (
                  <div className="flex flex-col mt-2 bg-gray-50 overflow-hidden transition-all duration-300 ease-in-out">
                    {subPackages[pkg._id]?.length > 0 ? (
                      subPackages[pkg._id].map((subPkg) => (
                        <Link
                          to={`/subpackages/${subPkg._id}`}
                          key={subPkg._id}
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          {subPkg.name}
                        </Link>
                      ))
                    ) : (
                      <p className="px-4 py-2 text-gray-500">No sub-packages</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          <p>Contact Us</p>
        </div>
      )}
    </div>
  );
};

export default Navbar;
