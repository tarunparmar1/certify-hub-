
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const EventDetails = () => {
  const { id } = useParams();

  // Event data
  const [event, setEvent] = useState(null);

  // Student data
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");

  // File states
  const [file, setFile] = useState(null);
  const [templateFile, setTemplateFile] = useState(null);
  const [template, setTemplate] = useState(null);

  // Certificate field positions
  const [positions, setPositions] = useState({
    name: { x: 300, y: 200 },
    enrollment: { x: 300, y: 250 },
    date: { x: 300, y: 300 },
    certificateId: { x: 300, y: 350 },
    qr: { x: 650, y: 400 },
  });
  //option for hide fields on certificate
  const [visibleFields, setVisibleFields] = useState({
    name: true,
    enrollment: true,
    date: true,
    certificateId: true,
    qr: true,
  });
  // Currently dragged field
  const [dragging, setDragging] = useState(null);

  // Starting mouse position
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0,
  });

  // Starting position of the field
  const [fieldStart, setFieldStart] = useState({
    x: 0,
    y: 0,
  });

  // Get event
  const getEvent = async () => {
    const { data } = await api.get(`/events/${id}`);

    setEvent(data.event);
  };

  // Get students
  const getStudents = async () => {
    const { data } = await api.get(`/students/${id}`);

    setStudents(data.students);
  };

  // Get certificate template
  const getTemplate = async () => {
    const { data } = await api.get(`/templates/${id}`);

    setTemplate(data.template);

    if (data.template?.positions) {
      setPositions(data.template.positions);
    }

    if (data.template?.visibleFields) {
      setVisibleFields(data.template.visibleFields);
    }
  };

  // Load event, students and template
  useEffect(() => {
    getEvent();
    getStudents();
    getTemplate();
  }, [id]);

  // Add one student manually
  const addStudent = async (e) => {
    e.preventDefault();

    await api.post("/students", {
      eventId: id,
      studentName,
      enrollmentNumber,
    });
    setStudentName("");
    setEnrollmentNumber("");

    getStudents();
    getEvent();
  };

  // Upload Excel file

  const uploadFile = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("eventId", id);

      const response = await api.post(
        "/students/upload",
        formData
      );

      console.log("Upload response:", response.data);

      alert(response.data.message || "Students uploaded successfully");

      setFile(null);

      getStudents();
      getEvent();

    } catch (error) {
      console.error(
        "Student upload error:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
        "Failed to upload student list"
      );
    }
  };



  // Upload certificate template
  const uploadTemplate = async (e) => {
    e.preventDefault();

    if (!templateFile) return;

    const formData = new FormData();

    formData.append("file", templateFile);
    formData.append("eventId", id);

    await api.post(
      "/templates/upload",
      formData
    );

    setTemplateFile(null);

    alert("Template uploaded successfully");

    getTemplate();
  };


  // Start dragging a certificate field
  const startDrag = (e, field) => {
    e.preventDefault();

    setDragging(field);

    // Store the mouse position when dragging starts
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });

    // Store the current position of the field
    setFieldStart({
      x: positions[field].x,
      y: positions[field].y,
    });
  };


  // Move the field while mouse is moving
  const moveDrag = (e) => {
    if (!dragging) return;

    // Calculate how far the mouse has moved
    const moveX = e.clientX - dragStart.x;
    const moveY = e.clientY - dragStart.y;

    // Calculate the new position
    let newX = fieldStart.x + moveX;
    let newY = fieldStart.y + moveY;

    // Keep the field inside the certificate
    newX = Math.max(0, Math.min(750, newX));
    newY = Math.max(0, Math.min(510, newY));

    // Update the position
    setPositions((prev) => ({
      ...prev,
      [dragging]: {
        x: newX,
        y: newY,
      },
    }));
  };


  // Stop dragging
  const stopDrag = () => {
    setDragging(null);
  };


  // Save positions to database
  const savePositions = async () => {
    try {
      await api.put("/templates/positions", {
        eventId: id,
        positions,
        visibleFields,
      });

      alert("Positions saved successfully");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to save positions"
      );
    }
  };

  // Loading screen
  if (!event) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div
      className="p-6"
      onMouseMove={moveDrag}
      onMouseUp={stopDrag}
    >
      {/* Event title */}
      <h1 className="text-2xl font-bold">
        {event.title}
      </h1>

      <p className="mt-2">
        {event.description}
      </p>

      {/* Event statistics */}
      <div className="flex gap-4 my-6">

        <div className="border p-4 rounded">
          <p>Total Students</p>
          <h2 className="text-xl font-bold">
            {event.totalStudents}
          </h2>
        </div>

        <div className="border p-4 rounded">
          <p>Total Certificates</p>
          <h2 className="text-xl font-bold">
            {event.totalCertificates}
          </h2>
        </div>

      </div>

      {/* Upload Students */}
      <form
        onSubmit={uploadFile}
        className="border p-4 rounded mb-6"
      >
        <h2 className="text-xl font-bold mb-3">
          Upload Students
        </h2>

        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
          className="mb-3 border p-2 rounded mr-2"
          required
        />

        <button
          type="submit"
          className="bg-[#FBBF24] text-white px-4 py-2 rounded"
        >
          Upload
        </button>
      </form>

      {/* Add Student */}
      <form
        onSubmit={addStudent}
        className="border p-4 rounded mb-6"
      >
        <h2 className="text-xl font-bold mb-3">
          Add Student
        </h2>

        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) =>
            setStudentName(e.target.value)
          }
          className="border p-2 mr-2"
          required
        />

        <input
          type="text"
          placeholder="Enrollment Number"
          value={enrollmentNumber}
          onChange={(e) =>
            setEnrollmentNumber(e.target.value)
          }
          className="border p-2 mr-2"
          required
        />

        <button
          type="submit"
          className="bg-[#FBBF24] text-white px-4 py-2 rounded"
        >
          Add Student
        </button>
      </form>

      {/* Upload Certificate Template */}
      <form
        onSubmit={uploadTemplate}
        className="border p-4 rounded mb-6"
      >
        <h2 className="text-xl font-bold mb-3">
          Upload Certificate Template
        </h2>

        <input
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={(e) =>
            setTemplateFile(e.target.files[0])
          }
          required
          className="mb-3 border p-2 rounded mr-2"
        />

        <button
          type="submit"
          className="bg-[#FBBF24] text-white px-4 py-2 rounded"
        >
          Upload Template
        </button>
      </form>

      {/* Certificate Position Editor */}
      <div className="border p-4 rounded mb-6">

        <h2 className="text-xl font-bold mb-4">
          Set Certificate Positions
        </h2>

        {template ? (
          <>
            {/* Responsive container */}
            <div className="w-full overflow-auto">

              {/* Fixed certificate coordinate area */}
              <div
                className="relative border overflow-hidden select-none"
                style={{
                  width: "800px",
                  height: "550px",
                  transformOrigin: "top left",
                }}
              >

                {/* Certificate template */}
                <img
                  src={template.fileUrl}
                  alt="Certificate Template"
                  className="absolute inset-0 w-full h-full object-fill"
                  draggable="false"
                />

                {/* NAME */}
                {visibleFields.name && (
                  <div
                    onMouseDown={(e) => startDrag(e, "name")}
                    style={{
                      position: "absolute",
                      left: positions.name.x,
                      top: positions.name.y,
                    }}
                    className="bg-white border border-blue-500 px-4 py-2 cursor-move font-bold"
                  >
                    NAME
                  </div>
                )}

                {/* ENROLLMENT */}
                {visibleFields.enrollment && (
                  <div
                    onMouseDown={(e) => startDrag(e, "enrollment")}
                    style={{
                      position: "absolute",
                      left: positions.enrollment.x,
                      top: positions.enrollment.y,
                    }}
                    className="bg-white border border-green-500 px-4 py-2 cursor-move"
                  >
                    ENROLLMENT
                  </div>
                )}

                {/* DATE */}
                {visibleFields.date && (
                  <div
                    onMouseDown={(e) => startDrag(e, "date")}
                    style={{
                      position: "absolute",
                      left: positions.date.x,
                      top: positions.date.y,
                    }}
                    className="bg-white border border-purple-500 px-4 py-2 cursor-move"
                  >
                    DATE
                  </div>
                )}

                {/* CERTIFICATE ID */}
                {visibleFields.certificateId && (
                  <div
                    onMouseDown={(e) => startDrag(e, "certificateId")}
                    style={{
                      position: "absolute",
                      left: positions.certificateId.x,
                      top: positions.certificateId.y,
                    }}
                    className="bg-white border border-orange-500 px-4 py-2 cursor-move"
                  >
                    CERTIFICATE ID
                  </div>
                )}

                {/* QR */}
                {visibleFields.qr && (
                  <div
                    onMouseDown={(e) => startDrag(e, "qr")}
                    style={{
                      position: "absolute",
                      left: positions.qr.x,
                      top: positions.qr.y,
                    }}
                    className="bg-white border border-red-500 p-4 cursor-move"
                  >
                    QR
                  </div>
                )}
                ```

              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-3">
                Certificate Fields
              </h3>

              <div className="flex flex-wrap gap-4">

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={visibleFields.name}
                    onChange={(e) =>
                      setVisibleFields({
                        ...visibleFields,
                        name: e.target.checked,
                      })
                    }
                  />
                  Name
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={visibleFields.enrollment}
                    onChange={(e) =>
                      setVisibleFields({
                        ...visibleFields,
                        enrollment: e.target.checked,
                      })
                    }
                  />
                  Enrollment Number
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={visibleFields.date}
                    onChange={(e) =>
                      setVisibleFields({
                        ...visibleFields,
                        date: e.target.checked,
                      })
                    }
                  />
                  Date
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={visibleFields.certificateId}
                    onChange={(e) =>
                      setVisibleFields({
                        ...visibleFields,
                        certificateId: e.target.checked,
                      })
                    }
                  />
                  Certificate ID
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={visibleFields.qr}
                    onChange={(e) =>
                      setVisibleFields({
                        ...visibleFields,
                        qr: e.target.checked,
                      })
                    }
                  />
                  QR Code
                </label>

              </div>
            </div>
            {/* Save button */}
            <button
              onClick={savePositions}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
            >
              Save Positions
            </button>
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Student Event Link</p>

              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/student?eventId=${id}`}
                  className="flex-1 border rounded px-3 py-2 bg-gray-50"
                />

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/student?eventId=${id}`
                    );
                    alert("Link copied!");
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Copy
                </button>
              </div>
            </div>

          </>
        ) : (
          <p>Upload a template first.</p>
        )}

      </div>




      {/* Students */}
      <h2 className="text-xl font-bold mb-3">
        Students
      </h2>

      {students.length === 0 ? (
        <p>No students added yet.</p>
      ) : (
        <div className="border rounded">

          {students.map((student) => (
            <div
              key={student._id}
              className="flex justify-between items-center p-3 border-b"
            >

              {/* Student information */}
              <div>
                <p>{student.studentName}</p>

                <p className="text-sm text-gray-500">
                  {student.enrollmentNumber}
                </p>
              </div>

              {/* Certificate status */}
              {/* <span
                className={
                  student.certificateStatus === "Generated"
                    ? "text-green-600"
                    : "text-gray-500"
                }
              >
                {student.certificateStatus}
              </span> */}

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default EventDetails;

