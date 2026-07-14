const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const VISITS_FILE = path.join(__dirname, "visits-remont.json"); // для 2-го сайта поменяешь на visits-otdelka.json
const PUBLIC_DIR = path.join(__dirname, "public");

app.use(express.static(PUBLIC_DIR));

function loadVisits() {
  if (!fs.existsSync(VISITS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(VISITS_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveVisits(data) {
  fs.writeFileSync(VISITS_FILE, JSON.stringify(data, null, 2), "utf8");
}

app.get("/api/visit", (req, res) => {
  const data = loadVisits();
  const now = new Date();
  const day = now.toISOString().slice(0, 10);
  const time = now.toISOString();

  if (!data[day]) {
    data[day] = { total: 0, visits: [] };
  }

  data[day].total += 1;
  data[day].visits.push(time);

  saveVisits(data);

  res.json({
    date: day,
    total: data[day].total,
    time
  });
});

app.listen(PORT, () => {
  console.log(`Server started: http://`);
});
