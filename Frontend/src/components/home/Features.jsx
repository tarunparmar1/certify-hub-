import { FaCertificate, FaQrcode, FaShieldAlt } from "react-icons/fa";

function Features() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-14">
          Features
        </h2>

        <div className="flex flex-wrap justify-center gap-8">

          {/* Card 1 */}
          <div className="w-full sm:w-[45%] md:w-[30%] shadow-lg rounded-xl p-8 text-center">
            <div className="flex justify-center mb-5 text-[#0F172A]">
              <FaCertificate size={35} />
            </div>

            <h3 className="text-2xl font-semibold">
              Certificate Generation
            </h3>

            <p className="mt-4 text-gray-600">
              Generate certificates instantly using templates.
            </p>
          </div>

          {/* Card 2 */}
          <div className="w-full sm:w-[45%] md:w-[30%] shadow-lg rounded-xl p-8 text-center">
            <div className="flex justify-center mb-5 text-[#0F172A]">
              <FaQrcode size={35} />
            </div>

            <h3 className="text-2xl font-semibold">
              QR Verification
            </h3>

            <p className="mt-4 text-gray-600">
              Verify certificates using QR codes.
            </p>
          </div>

          {/* Card 3 */}
          <div className="w-full sm:w-[45%] md:w-[30%] shadow-lg rounded-xl p-8 text-center">
            <div className="flex justify-center mb-5 text-[#0F172A]">
              <FaShieldAlt size={35} />
            </div>

            <h3 className="text-2xl font-semibold">
              Secure
            </h3>

            <p className="mt-4 text-gray-600">
              Unique certificate ID prevents forgery.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Features;