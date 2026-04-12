const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());

// ================= DATABASE =================
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud_react"
});

db.connect((err) => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("MySQL Connected");
  }
});

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("API jalan...");
});

// ================= REGISTER =================
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ message: "Semua field wajib diisi!" });
  }

  const hash = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, hash], (err) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Register gagal!" });
    }

    return res.json({ message: "Register berhasil!" });
  });
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Error server" });
    }

    if (result.length === 0) {
      return res.json({ message: "User tidak ditemukan" });
    }

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({ message: "Password salah" });
    }

    return res.json({
      message: "Login berhasil",
      user: user,
    });
  });
});

// ================= CRUD BARANG =================

// 🔍 GET barang per user
app.get("/barangs/:user_id", (req, res) => {
  const { user_id } = req.params;

  const sql = "SELECT * FROM barangs WHERE user_id = ?";

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Gagal ambil data" });
    }

    return res.json(result);
  });
});

// ➕ TAMBAH barang
app.post("/barangs", (req, res) => {
  const { nama, stok, user_id } = req.body;

  if (!nama || !stok || !user_id) {
    return res.json({ message: "Data tidak lengkap!" });
  }

  const sql = "INSERT INTO barangs (nama, stok, user_id) VALUES (?, ?, ?)";

  db.query(sql, [nama, stok, user_id], (err) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Gagal tambah data" });
    }

    return res.json({ message: "Data ditambahkan" });
  });
});

// ✏️ UPDATE barang
app.put("/barangs/:id/:user_id", (req, res) => {
  const { id, user_id } = req.params;
  const { nama, stok } = req.body;

  const sql = "UPDATE barangs SET nama=?, stok=? WHERE id=? AND user_id=?";

  db.query(sql, [nama, stok, id, user_id], (err) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Gagal update" });
    }

    return res.json({ message: "Data diupdate" });
  });
});

// ❌ DELETE barang
app.delete("/barangs/:id/:user_id", (req, res) => {
  const { id, user_id } = req.params;

  const sql = "DELETE FROM barangs WHERE id=? AND user_id=?";

  db.query(sql, [id, user_id], (err) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Gagal hapus data" });
    }

    return res.json({ message: "Data dihapus" });
  });
});

// ================= START SERVER =================
app.listen(5000, () => {
  console.log("Server jalan di http://localhost:5000");
});