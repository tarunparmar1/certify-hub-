import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const AddEvent = () => {
  const navigate = useNavigate();

  const [event, setEvent] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post("/events", event);

    if (response.data.success) {
      navigate(`/admin/events/${response.data.event._id}`);
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message || "Failed to create event"
    );
  }
};

  return (
    <div className="p-6 max-w-2xl">

      <h1 className="text-2xl font-bold mb-6">
        Add Event
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block mb-2 font-medium">
            Event Name
          </label>

          <input
            type="text"
            name="title"
            value={event.title}
            onChange={handleChange}
            placeholder="Enter event name"
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Description
          </label>

          <textarea
            name="description"
            value={event.description}
            onChange={handleChange}
            placeholder="Enter description"
            rows="4"
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Start Date
          </label>

          <input
            type="date"
            name="startDate"
            value={event.startDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            End Date
          </label>

          <input
            type="date"
            name="endDate"
            value={event.endDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Create Event
        </button>

      </form>

    </div>
  );
};

export default AddEvent;