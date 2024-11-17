import Logo from "../assets/logo.jpg";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-6 bg-white shadow-lg rounded-lg py-8">
        <div className="flex justify-center items-center gap-4 text-3xl font-bold text-gray-800 text-center mb-8">
          <img src={Logo} alt="Vachanika Logo" className="h-12 w-12" />
          Vachanika
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Terms and Conditions
        </h1>

        <div className="space-y-6">
          {/* Section 1: Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              1. Introduction
            </h2>
            <p className="text-gray-600">
              Welcome to Vachanika. By accessing or using our website, you agree
              to comply with and be bound by the following terms and conditions.
              If you do not agree with any part of these terms, you are
              prohibited from using this site.
            </p>
          </section>

          {/* Section 2: User Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              2. User Responsibilities
            </h2>
            <p className="text-gray-600">
              As a user, you agree to provide accurate and current information
              during registration. You are responsible for maintaining the
              confidentiality of your account credentials and are liable for all
              activities conducted under your account.
            </p>
          </section>

          {/* Section 3: Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              3. Prohibited Activities
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Using the website for unlawful purposes.</li>
              <li>
                Engaging in activities that could harm the website or its users.
              </li>
              <li>Attempting to access unauthorized areas of the site.</li>
              <li>
                Sharing or distributing copyrighted content without permission.
              </li>
            </ul>
          </section>

          {/* Section 4: Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              4. Intellectual Property
            </h2>
            <p className="text-gray-600">
              All content, logos, and trademarks displayed on this site are the
              property of Vachanika or its content providers. You may not
              reproduce, distribute, or modify any part of this content without
              prior written consent.
            </p>
          </section>

          {/* Section 5: Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              5. Termination
            </h2>
            <p className="text-gray-600">
              We reserve the right to terminate or suspend your access to our
              website without notice if you violate these terms or engage in
              activities deemed harmful to our platform or users.
            </p>
          </section>

          {/* Section 6: Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              6. Changes to Terms
            </h2>
            <p className="text-gray-600">
              Vachanika reserves the right to update these terms at any time.
              Any changes will be effective immediately upon posting. Your
              continued use of the site signifies acceptance of the updated
              terms.
            </p>
          </section>

          {/* Section 7: Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              7. Contact Information
            </h2>
            <p className="text-gray-600">
              If you have any questions or concerns regarding these terms, feel
              free to contact us at:
            </p>
            <ul className="list-none space-y-2 mt-2 text-gray-600">
              <li>📍 Address: Pune, Maharashtra</li>
              <li>📧 Email: utkarsh09jan@gmail.com</li>
              <li>📞 Phone: +91 63505 55537</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
