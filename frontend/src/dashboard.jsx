import "./App.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [barangs, setBarangs] = useState([]);
  const [nama, setNama] = useState("");
  const [stok, setStok] = useState("");
  const [editId, setEditId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    navigate("/");
    return null;
  }

  useEffect(() => {
  if (user) {
    getData();
  }
  }, [user]);

  const getData = async () => {
  if (!user) return;

    const res = await fetch(`http://localhost:5000/barangs/${user.id}`);
    const data = await res.json();
    setBarangs(data);
  };

  useEffect(() => {
    if (user) getData();
  }, []);

  // tambah / SIMPAN
  const handleSubmit = async () => {
    if (!nama || !stok) {
      alert("Isi semua field!");
      return;
    }

    if (editId) {
      // UPDATE
      await fetch(`http://localhost:5000/barangs/${editId}/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nama, stok }),
      });
    } else {
      // CREATE
      await fetch("http://localhost:5000/barangs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama,
          stok,
          user_id: user.id,
        }),
      });
    }

    setNama("");
    setStok("");
    setEditId(null);
    getData();
  };

  // EDIT
  const handleEdit = (item) => {
    setNama(item.nama);
    setStok(item.stok);
    setEditId(item.id);
  };

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/barangs/${id}/${user.id}`, {
      method: "DELETE",
    });
    getData();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        
        <div className="header">
          <h2>Dashboard</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <h3>Halo, {user?.name}</h3>

        {/* FORM */}
        <div className="form">
          <input
            type="text"
            placeholder="Nama Barang"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />

          <input
            type="number"
            placeholder="Stok"
            value={stok}
            onChange={(e) => setStok(e.target.value)}
          />

          <button onClick={handleSubmit}>
            {editId ? "Update Barang" : "Tambah Barang"}
          </button>
        </div>

        {/* LIST */}
        <div className="list">
          <ul>
            {barangs.map((item) => (
              <li key={item.id}>
                {item.nama} - {item.stok}

                <button
                  onClick={() => handleEdit(item)}
                  style={{
                    marginLeft: "10px",
                    background: "orange",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    marginLeft: "5px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;