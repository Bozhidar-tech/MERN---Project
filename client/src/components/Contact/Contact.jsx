import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ property }) {
  const [landlord, setLandlord] = useState(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${property.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          return;
        }
        setLandlord(data);
        setError(false);
      } catch (error) {
        setError(true);
      }
    };
    fetchLandlord();
  }, [property.userRef]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">
              {property.title.toLowerCase()}
            </span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>

          <Link
            to={`mailto: ${landlord.email}?subject=Regarding${property.title}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}