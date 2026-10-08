import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

function Student() {
  const [searchParams] = useSearchParams();

  const eventId = searchParams.get("eventId");

  const [enrollmentNumber, setEnrollmentNumber] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const downloadCertificate = async () => {
    if (!eventId) {
      setError("Invalid event link");
      return;
    }

    if (!enrollmentNumber.trim()) {
      setError("Please enter enrollment number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post(
        "/certificates/generate",
        {
          eventId,
          enrollmentNumber:
            enrollmentNumber.trim(),
        },
        {
          responseType: "blob",
        }
      );

      // Create PDF download
      const blob = new Blob(
        [response.data],
        {
          type: "application/pdf",
        }
      );

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = "certificate.pdf";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error);

      setError(
        "Student not found or certificate could not be generated"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6">

        <h1 className="text-2xl font-bold mb-2">
          Download Certificate
        </h1>

        <p className="text-gray-500 mb-6">
          Enter your enrollment number
        </p>

        <input
          type="text"
          value={enrollmentNumber}
          onChange={(e) =>
            setEnrollmentNumber(e.target.value)
          }
          placeholder="Enter enrollment number"
          className="w-full border rounded-lg p-3 mb-4"
        />

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        <button
          onClick={downloadCertificate}
          disabled={loading}
          className="w-full bg-[#FBBF24] text-white rounded-lg p-3"
        >
          {loading
            ? "Generating..."
            : "Download Certificate"}
        </button>

      </div>
    </div>
  );
}

export default Student;