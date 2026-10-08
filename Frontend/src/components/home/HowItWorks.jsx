function HowItWorks() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center mb-4">
          How It Works
        </h2>

        <p className="text-center text-gray-600 mb-12">
          A simple process for generating and verifying digital certificates.
        </p>

        <div className="flex flex-wrap justify-center gap-8">

          {/* Step 1 */}
          <div className="w-full sm:w-[45%] md:w-[22%] text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FBBF24] text-white flex items-center justify-center text-xl font-bold">
              01
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Create an Event
            </h3>

            <p className="text-gray-600">
              The admin creates an event for a seminar, workshop, or other programme.
            </p>
          </div>

          {/* Step 2 */}
          <div className="w-full sm:w-[45%] md:w-[22%] text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FBBF24] text-white flex items-center justify-center text-xl font-bold">
              02
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Upload Student Data
            </h3>

            <p className="text-gray-600">
              Upload eligible student information using an Excel or CSV file.
            </p>
          </div>

          {/* Step 3 */}
          <div className="w-full sm:w-[45%] md:w-[22%] text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FBBF24] text-white flex items-center justify-center text-xl font-bold">
              03
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Generate Certificate
            </h3>

            <p className="text-gray-600">
              Certificates are generated dynamically with a unique Certificate ID and QR code.
            </p>
          </div>

          {/* Step 4 */}
          <div className="w-full sm:w-[45%] md:w-[22%] text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FBBF24] text-white flex items-center justify-center text-xl font-bold">
              04
            </div>

            <h3 className="text-xl font-semibold mb-3">
              Verify Certificate
            </h3>

            <p className="text-gray-600">
              Anyone can verify a certificate using its QR code or Certificate ID.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;