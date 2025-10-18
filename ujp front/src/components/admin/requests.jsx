import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Reusable Confirmation Modal
const ConfirmationModal = ({ isOpen, onConfirm, onCancel, actionType, itemName }) => {
  if (!isOpen) return null;

  const title = actionType === "approve" ? "Confirm Approval" : "Confirm Rejection";
  const message =
    actionType === "approve"
      ? `Are you sure you want to approve ${itemName}?`
      : `Are you sure you want to reject ${itemName}?`;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(75, 85, 99, 0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "0.5rem",
          padding: "2rem",
          width: "90%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "700",
            marginBottom: "1rem",
            color: actionType === "approve" ? "#000f" : "#000f",
          }}
        >
          {title}
        </h2>
        <p style={{ color: "#374151", marginBottom: "1.5rem" }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              borderRadius: "0.375rem",
              backgroundColor: "#4f46e5",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              borderRadius: "0.375rem",
              backgroundColor: actionType === "approve" ? "#22c55e" : "#dc3545",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {actionType === "approve" ? "Approve" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminEmployerReview = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null); // { id, name, type }

  // ✅ Fetch pending temporary employers
  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const res = await axios.get("/api/admin/temporary-list"); // adjust base URL if needed
        setEmployers(res.data);
      } catch (err) {
        console.error("Error fetching temporary employers:", err);
        toast.error("Failed to fetch pending requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployers();
  }, []);

  // ✅ Approve handler
  const handleApprove = async (id) => {
    try {
      await axios.post(`/api/admin/temporary-list/approve/${id}`);
      setEmployers((prev) => prev.filter((emp) => emp._id !== id));
      toast.success("Employer approved successfully!");
    } catch (err) {
      console.error("Error approving employer:", err);
      toast.error("Failed to approve employer.");
    }
  };

  // ✅ Reject handler
  const handleReject = async (id) => {
    try {
      await axios.post(`/api/admin/temporary-list/reject/${id}`);
      setEmployers((prev) => prev.filter((emp) => emp._id !== id));
      toast.success("Employer rejected successfully!");
    } catch (err) {
      console.error("Error rejecting employer:", err);
      toast.error("Failed to reject employer.");
    }
  };

  // ✅ View certificate
  const handleViewCertificate = (filePath) => {
    if (!filePath) return toast.warn("No certificate uploaded.");
    const certificateUrl = filePath.startsWith("http") ? filePath : `http://localhost:5000${filePath}`;
    window.open(certificateUrl, "_blank");
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px", fontSize: "1.2rem", color: "#555" }}>
        Loading pending requests...
      </div>
    );

  return (
    <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333", fontFamily: "monospace" }}>
        Pending Employer Requests
      </h2>

      <div
        style={{
          overflowX: "auto",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#2b2b2bff", color: "#fff", textAlign: "left" }}>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Email</th>
              <th style={{ padding: "12px" }}>Company</th>
              <th style={{ padding: "12px" }}>Location</th>
              <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employers.length > 0 ? (
              employers.map((emp) => (
                <tr
                  key={emp._id}
                  style={{ borderBottom: "1px solid #ddd", transition: "background 0.3s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f1f1")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px" }}>{emp.name}</td>
                  <td style={{ padding: "12px" }}>{emp.email}</td>
                  <td style={{ padding: "12px" }}>{emp.companyName}</td>
                  <td style={{ padding: "12px" }}>{emp.location}</td>
                  <td style={{ textAlign: "center", padding: "12px" }}>
                    <button
                      onClick={() => handleViewCertificate(emp.certificateFilePath)}
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        marginRight: "8px",
                      }}
                    >
                      View Certificate
                    </button>
                    <button
                      onClick={() => setModalData({ id: emp._id, name: emp.name, type: "approve" })}
                      style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        marginRight: "8px",
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setModalData({ id: emp._id, name: emp.name, type: "reject" })}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        cursor: "pointer",
                        borderRadius: "4px",
                      }}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "15px", color: "#666" }}>
                  No pending requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!modalData}
        onConfirm={() => {
          if (modalData?.type === "approve") handleApprove(modalData.id);
          else handleReject(modalData.id);
          setModalData(null);
        }}
        onCancel={() => setModalData(null)}
        actionType={modalData?.type}
        itemName={modalData?.name}
      />
    </div>
  );
};

export default AdminEmployerReview;
