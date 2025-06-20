import Link from "next/link";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa"; // Assuming you have react-icons installed
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#f5b86a] text-gray-800 mt-16 border-t border-gray-400"> {/* Changed overall text color to gray-800 and border to gray-400 */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 text-orange-900 font-bold text-xl mb-3" // Darker orange for the logo text
          >
            {Logo && <Logo className="w-8 h-8" />} {/* Render Logo if provided */}
            StreetBites
          </Link>
          <p className="text-sm text-gray-700"> {/* Gray-700 works well here for descriptive text */}
            Your ultimate guide to delicious street food around the globe.
            Discover, share, and savor the best bites!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h3> {/* Headings are darker for emphasis */}
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="text-gray-700 hover:text-orange-900 transition-colors duration-300" // Link text is gray-700, hovers to dark orange
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="text-gray-700 hover:text-orange-900 transition-colors duration-300"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/subscripton-plan"
                className="text-gray-700 hover:text-orange-900 transition-colors duration-300"
              >
                Go Premium
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="text-gray-700 hover:text-orange-900 transition-colors duration-300"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories/Explore */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Explore</h3> {/* Headings are darker for emphasis */}
          <ul className="space-y-2">
            <li>
              <Link
                href="/posts"
                className="text-gray-700 hover:text-orange-900 transition-colors duration-300"
              >
                Asian Street Food
              </Link>
            </li>
            <li>
              <Link
                href="/posts"
                className="text-gray-700 hover:text-orange-900 transition-colors duration-300"
              >
                Mexican Delights
              </Link>
            </li>
            <li>
              <Link
                href="/posts"
                className="text-gray-700 hover:text-orange-900 transition-colors duration-300"
              >
                European Flavors
              </Link>
            </li>
            <li>
              <Link
                href="/posts"
                className="text-gray-700 hover:text-orange-900 transition-colors duration-300"
              >
                Our Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Connect With Us</h3> {/* Headings are darker for emphasis */}
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/iftakhar.shuvo.2024/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-orange-900 transition-colors duration-300" // Icons are gray-700, hover to dark orange
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://github.com/alamshuvo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-orange-900 transition-colors duration-300"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/iftakhar-alam-shuvo/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-orange-900 transition-colors duration-300"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright and Bottom Text */}
      <div className="border-t border-gray-400 mt-8 pt-8 text-center text-sm text-gray-800"> {/* Border and text color adjusted */}
        © {new Date().getFullYear()} StreetBites. All rights reserved.
      </div>
    </div>
  </footer>
  );
}
