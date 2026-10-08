
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

function Verify() {
  const [searchParams, setSearchParams] = useSearchParams();

  const qrCertificateId = searchParams.get("id");

  const [certificateId, setCertificateId] = useState(
    qrCertificateId || ""
  );
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyCertificate = async (id) => {
    if (!id.trim()) {
      setError("Please enter Certificate ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCertificate(null);

      const response = await api.get(
        `/certificates/verify?id=${encodeURIComponent(id.trim())}`
      );

      if (response.data.valid) {
        setCertificate(response.data.certificate);

        // Keep certificate ID in URL
        setSearchParams({ id: id.trim() });
      } else {
        setError("Invalid certificate");
      }
    } catch (error) {
      console.error("Verification error:", error);

      setError(
        error.response?.data?.message || "Invalid certificate"
      );
    } finally {
      setLoading(false);
    }
  };

  // Automatically verify when opened through QR
  useEffect(() => {
    if (qrCertificateId) {
      verifyCertificate(qrCertificateId);
    }
  }, [qrCertificateId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">

        <h1 className="text-2xl font-bold text-center mb-2">
          Verify Certificate
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Enter Certificate ID to verify
        </p>

        {/* Certificate ID Input */}
        <input
          type="text"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
          placeholder="Enter Certificate ID"
          className="w-full border rounded-lg px-3 py-3 mb-3"
        />

        <button
          onClick={() => verifyCertificate(certificateId)}
          disabled={loading}
          className="w-full bg-[#FBBF24] text-white rounded-lg py-3"
        >
          {loading ? "Verifying..." : "Verify Certificate"}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-5 p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Verified Certificate */}
        {certificate && (
          <div className="mt-6 border rounded-lg p-5">

            <h2 className="text-xl font-bold text-green-600 mb-5">
              Certificate Verified ✓
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-sm text-gray-500">
                  Student Name
                </p>
                <p className="font-semibold">
                  {certificate.studentName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Event Name
                </p>
                <p className="font-semibold">
                  {certificate.eventName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Enrollment Number
                </p>
                <p className="font-semibold">
                  {certificate.enrollmentNumber}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Certificate ID
                </p>
                <p className="font-semibold break-all">
                  {certificate.certificateId}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Issued Date
                </p>
                <p className="font-semibold">
                  {new Date(
                    certificate.issuedDate
                  ).toLocaleDateString()}
                </p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Verify;

