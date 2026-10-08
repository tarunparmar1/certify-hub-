import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Events = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
const getEvents = async () => {
  try {
    const response = await api.get("/events");

    if (response.data.success) {
      setEvents(response.data.events);
    }
  } catch (error) {
    console.error("Get events error:", error);
  }
};

  useEffect(() => {
    getEvents();
  }, []);

const deleteEvent = async (id) => {
  const confirmDelete = window.confirm(
    "Delete this event?"
  );

  if (!confirmDelete) return;

  try {
    const response = await api.delete(`/events/${id}`);

    if (response.data.success) {
      getEvents();
    }
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
        "Failed to delete event"
    );
  }
};
const totalStudents = events.reduce(
  (total, event) => total + (event.totalStudents || 0),
  0
);
const totalEvents = events.length;
  return (
    <div className="p-6">
      <div className="flex gap-6">
      <div className="border rounded-lg p-5 mb-6 w-[50%]">
  <p className="text-gray-500">Total Students</p>
  <h2 className="text-3xl font-bold">
    {totalStudents}
  </h2>
  
</div>
<div className="border rounded-lg p-5 mb-6 w-[50%]">
  <p className="text-gray-500">Total Events</p>
  <h2 className="text-3xl font-bold">
    {totalEvents}
  </h2>
</div>
</div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Events
        </h1>

        <button
          onClick={() => navigate("/admin/events/new")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          + Add Event
        </button>

      </div>

      <div className="border rounded-lg overflow-hidden">

        <table className="w-full text-left">

          <thead>
            <tr className="border-b bg-gray-50">

              <th className="p-4">
                Event
              </th>

              <th className="p-4">
                Students
              </th>

              <th className="p-4">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {events.map((event) => (

              <tr
                key={event._id}
                className="border-b"
              >

                <td className="p-4">
                  {event.title}
                </td>

                <td className="p-4">
                  {event.totalStudents}
                </td>

                <td className="p-4">

                  <button
                    onClick={() =>
                      navigate(`/admin/events/${event._id}`)
                    }
                    className="text-blue-600 mr-4"
                  >
                    View
                  </button>

                  <button
                    onClick={() => deleteEvent(event._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Events;