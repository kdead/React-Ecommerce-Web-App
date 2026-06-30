import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Read: load this user's profile doc on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const snap = await getDoc(doc(db, "users", currentUser.uid));
      if (snap.exists()) {
        setName(snap.data().name || "");
        setAddress(snap.data().address || "");
      }
      setLoading(false);
    };
    fetchProfile();
  }, [currentUser]);

  // Update: save edited name/address back to Firestore
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    await updateDoc(doc(db, "users", currentUser.uid), { name, address });
    setMessage("Profile updated.");
  };

  // Delete: re-authenticate, then remove the Firestore doc and the Auth account
  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteError("");
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        deletePassword,
      );
      await reauthenticateWithCredential(currentUser, credential);

      await deleteDoc(doc(db, "users", currentUser.uid));
      await deleteUser(currentUser);

      navigate("/"); // onAuthStateChanged will clear currentUser automatically
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  if (loading) return <p className="status">Loading profile...</p>;

  return (
    <div className="auth-form">
      <h2>Your Profile</h2>
      {message && <p className="success">{message}</p>}

      <form onSubmit={handleUpdate}>
        <label>Email</label>
        <input type="email" value={currentUser.email} disabled />

        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Address</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} />

        <button type="submit" className="btn">
          Save Changes
        </button>
      </form>

      <hr />

      {!showDeleteForm ? (
        <button className="btn remove" onClick={() => setShowDeleteForm(true)}>
          Delete Account
        </button>
      ) : (
        <form onSubmit={handleDelete}>
          <p>
            Enter your password to confirm account deletion. This cannot be
            undone.
          </p>
          {deleteError && <p className="error">{deleteError}</p>}
          <input
            type="password"
            placeholder="Password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            required
          />
          <button type="submit" className="btn remove">
            Confirm Delete
          </button>
          <button
            type="button"
            className="btn-link"
            onClick={() => setShowDeleteForm(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
