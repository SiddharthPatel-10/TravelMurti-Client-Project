import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const contactInfo = [
    "4th Floor, Kamal Bhati Market, Sector-86, Yakubpur, Noida, Uttar Pradesh, 201305, India",
    "Mob: +91 8527036496",
    "Email: contact.travelmurti@gmail.com",
  ];

  const services = [
    { name: "Spiritual Tours", path: "/" },
    { name: "Holiday Tours", path: "/" },
    { name: "Honeymoon Tours", path: "/" },
    { name: "Weekend Tours", path: "/weekend-tours" },
  ];

  const socialMediaLinks = [
    {
      icon: <FaFacebookF />,
      url: "https://www.facebook.com/people/Travel-murti/61566336124658/?mibextid=ZbWKwL",
    },
    {
      icon: <FaTwitter />,
      url: "https://twitter.com",
    },
    {
      icon: <FaInstagram />,
      url: "https://www.instagram.com/travelmurti/profilecard/?igsh=dWRrNTFsYzlrOGht",
    },
    {
      icon: <FaLinkedinIn />,
      url: "https://in.linkedin.com/in/travel-murti-54aa8b235",
    },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Why us?", path: "/about" },
    { name: "About Us", path: "/about" },
    { name: "Travel Tips", path: "/" },
    { name: "Travel Insurance", path: "/" },
    { name: "Contact Us", path: "/contact" },
    { name: "We are Hiring", path: "/we-are-hiring" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms & Conditions", path: "/terms-conditions" },
    { name: "Cancellation & Refund Policy", path: "/cancellation-refund-policy" },
    { name: "Tour Package Booking T&C", path: "/tour-booking-t-c" },
  ];

  return (
    <footer className="bg-gray-800 text-white border-t border-gray-300">
      <div className="max-w-screen-xl mx-auto px-4 pt-8 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Column 1: Additional Links */}
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <div className="border-b border-gray-300 mb-4"></div>
            <ul className="space-y-2 text-gray-700">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="cursor-pointer text-white hover:text-blue-600 transition duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Services */}
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Our Services</h2>
            <div className="border-b border-gray-300 mb-4"></div>
            <ul className="space-y-2 text-gray-700">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    to={service.path}
                    className="cursor-pointer text-white hover:text-blue-600 transition duration-200"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Legal</h2>
            <div className="border-b border-gray-300 mb-4"></div>
            <ul className="space-y-2 text-gray-700">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="cursor-pointer text-white hover:text-blue-600 transition duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social Media Icons */}
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Contact Us</h2>
            <div className="border-b border-gray-300 mb-4"></div>

            <ul className="space-y-2 text-gray-700">
              {contactInfo.map((info, index) => {
                let contactLink;

                // Check if the info contains "Tel", "Mob", or "Email"
                if (info.startsWith("Tel:")) {
                  contactLink = `tel:${info.replace("Tel: ", "")}`;
                } else if (info.startsWith("Mob:")) {
                  contactLink = `tel:${info.replace("Mob: ", "")}`;
                } else if (info.startsWith("Email:")) {
                  contactLink = `mailto:${info.replace("Email: ", "")}`;
                } else {
                  contactLink = "";
                }

                return (
                  <li
                    key={index}
                    className={`cursor-pointer text-white hover:text-blue-600 transition duration-200`}
                  >
                    {contactLink ? (
                      <a
                        href={contactLink}
                        rel="noopener noreferrer"
                        className="no-underline hover:underline"
                      >
                        {info}
                      </a>
                    ) : (
                      info
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-row items-center justify-start space-x-4 md:space-x-4 ml-2 my-6">
              {socialMediaLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-600 transition duration-200 text-3xl"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Gray Line Below Columns */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* Copyright Section */}
        <div className="text-center text-white py-4">
          <p className="text-sm">
            Copyright © Travel Murti {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
