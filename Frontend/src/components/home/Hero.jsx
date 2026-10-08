import { Link } from "react-router-dom";
import certificate from "../../assets/certificate.png"

function Hero() {
  return (
    <section className=" bg-slate-50 min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        <div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Digital Certificate
            <span className="text-[#FBBF24]"> Generation</span>
          </h1>

          <p className="text-gray-600 mt-6 text-lg">
            Generate, manage and verify certificates securely using QR Codes
            and unique Certificate IDs.
          </p>

          <div className="flex gap-4 mt-8">
            <Link
              to="/verify"
              className="bg-[#FBBF24] text-white px-6 py-3 rounded-lg hover:text-[17px] transition-all duration-300"
            >
              Verify Certificate
            </Link>

            <Link
              to="/login"
              className="border border-[#FBBF24] text-[#d49801] px-6 py-3 rounded-lg hover:text-[17px]  transition-all duration-300"
            >
              Certificate Manager login
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src={certificate}
            alt="Certificate"
            className="w-full max-w-md border-5 border-amber-500"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;