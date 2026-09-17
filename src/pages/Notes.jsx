import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Notes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/notes",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNotes(response.data);

    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/notes",
        {
          title,
          content
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTitle("");
      setContent("");

      fetchNotes();

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to create note"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/notes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNotes(
        notes.filter((note) => note._id !== id)
      );

    } catch (error) {
      alert("Failed to delete note");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <h1>My Notes</h1>

      <button onClick={handleLogout}>
        Logout
      </button>

      <hr />

      <h2>Create Note</h2>

      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="submit">
          Add Note
        </button>
      </form>

      <hr />

      <h2>Your Notes</h2>

      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        notes.map((note) => (
          <div key={note._id}>
            <h3>{note.title}</h3>

            <p>{note.content}</p>

            <button
              onClick={() => handleDelete(note._id)}
            >
              Delete
            </button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Notes;