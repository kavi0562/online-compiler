import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{
      display: "flex",
      gap: "20px",
      padding: "10px",
      borderBottom: "1px solid #ccc"
    }}>
      <Link to="/">Home</Link>

      {role === "user" && <Link to="/user">User Dashboard</Link>}
      {role === "admin" && <Link to="/admin">Admin Dashboard</Link>}

      {role && (
        <button onClick={logout} style={{ marginLeft: "auto" }}>
          Logout
        </button>
      )}
    </div>
  );
}

export default Navbar;

