export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1: Logo & Description */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-indigo-400">Vachanika</h1>
          <p className="text-gray-400 text-base">
            A modern library system for discovering, managing, and sharing books
            with ease. Join us in revolutionizing the reading experience.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-indigo-400">Quick Links</h3>
          <ul className="space-y-3 text-gray-400 text-base">
            <li>
              <a
                href="#home"
                className="hover:text-indigo-400 transition duration-300"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#browse"
                className="hover:text-indigo-400 transition duration-300"
              >
                Browse Books
              </a>
            </li>
            <li>
              <a
                href="#borrow"
                className="hover:text-indigo-400 transition duration-300"
              >
                Borrow Books
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hover:text-indigo-400 transition duration-300"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Social Media */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-indigo-400">Follow Us</h3>
          <div className="flex space-x-6">
            <a
              href="https://www.github.com/utkarshagrrawal"
              target="_blank"
              rel="noreferrer noopener"
            >
              Github
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Column 4: Contact Info */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-indigo-400">
            Contact Info
          </h3>
          <ul className="space-y-3 text-gray-400 text-base">
            <li>
              <span>📍 Address: Pune, Maharashtra</span>
            </li>
            <li>
              <span>📞 Phone: +91 63505 55537</span>
            </li>
            <li>
              <span>📧 Email: utkarsh09jan@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center mt-12 text-gray-500 text-sm border-t border-gray-700 pt-6">
        <p>© {new Date().getFullYear()} Vachanika. All rights reserved.</p>
      </div>
    </footer>
  );
}
