import { useState } from "react";
import { addDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { db, auth } from "./firebase";

function CreateIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");

  //  Similar Issue Check Function
  const checkSimilarIssue = async (newTitle) => {
    const snapshot = await getDocs(collection(db, "issues"));

    for (let doc of snapshot.docs) {
      const existingTitle = doc.data().title.toLowerCase();

      if (existingTitle.includes(newTitle.toLowerCase())) {
        return true; // similar issue found
      }
    }
    return false; // no similar issue
  };

  // Create Issue Function
  const handleCreateIssue = async () => {
    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    // Step 1: Check similar issue
    const isSimilar = await checkSimilarIssue(title);

    if (isSimilar) {
      const confirmCreate = window.confirm(
        "Similar issue already exists. Do you still want to create this issue?"
      );

      if (!confirmCreate) {
        return; // user cancelled
      }
    }

    // Step 2: Create issue in Firestore
    await addDoc(collection(db, "issues"), {
      title: title,
      description: description,
      priority: priority,
      status: "Open",
      assignedTo: auth.currentUser.email,
      createdBy: auth.currentUser.email,
      createdAt: Timestamp.now(),
    });

    alert("Issue created successfully");

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("Low");
  };

  return (
    <div style={{ border: "1px solid gray", padding: "15px", marginTop: "20px" }}>
      <h2>Create Issue</h2>

      <input
        type="text"
        placeholder="Issue Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />

      <textarea
        placeholder="Issue Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br /><br />

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <br /><br />

      <button onClick={handleCreateIssue}>Create Issue</button>
    </div>
  );
}

export default CreateIssue;
