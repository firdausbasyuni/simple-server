const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let submissions = [];
let nextId = 1;

app.post("/api/post_submission_data", (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({
      ok: false,
      error: "Field 'name' and 'email' are required.",
    });
  }

  const item = {
    id: nextId++,
    name,
    email,
    message: message || "",
    createdAt: new Date().toISOString(),
  };

  submissions.push(item);
  return res.status(201).json({ ok: true, data: item });
});

app.get("/api/get_all_submission_data", (req, res) => {
  res.json({ ok: true, data: submissions });
});

app.get("/api/get_submission_data_by_id/:id", (req, res) => {
  const id = Number(req.params.id);
  const found = submissions.find((s) => s.id === id);
  if (!found) return res.status(404).json({ ok: false, error: "Not found" });
  res.json({ ok: true, data: found });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});