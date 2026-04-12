import { Link } from "react-router-dom";
// import "./managerdashboard.css";

export default function ManagerLayout({ children }) {
  return (
    <div className="dashboard-container">

      <div className="sidebar">
        <h2>Manager</h2>
        <hr />

        <ul>
          <li><Link to="/manager">Dashboard</Link></li>
          <li><Link to="/manager/pending">Pending Approvals</Link></li>
          <li><Link to="/manager/approved">Approved Requests</Link></li>
        </ul>

        <button className="logout-btn">Logout</button>
      </div>

      <div className="main-content">
        {children}
      </div>

    </div>
  );
}