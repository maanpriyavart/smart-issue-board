import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

function IssueList() {
  const [issues, setIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  useEffect(() => {
    const fetchIssues = async () => {
      const q = query(
        collection(db, "issues"),
        orderBy("createdAt", "desc") // newest first
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setIssues(data);
    };

    fetchIssues();
  }, []);

  // Filter logic
  const filteredIssues = issues.filter(issue => {
    return (
      (statusFilter === "All" || issue.status === statusFilter) &&
      (priorityFilter === "All" || issue.priority === priorityFilter)
    );
  });

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Issue List</h2>

      {/* Filters */}
      <select onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="All">All Status</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      <select onChange={(e) => setPriorityFilter(e.target.value)}>
        <option value="All">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <hr />

      {/* Issue Cards */}
      {filteredIssues.map(issue => (
        <div key={issue.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h4>{issue.title}</h4>
          <p>{issue.description}</p>
          <p>Status: {issue.status}</p>
          <p>Priority: {issue.priority}</p>
          <p>Assigned To: {issue.assignedTo}</p>
        </div>
      ))}
    </div>
  );
}

export default IssueList;
