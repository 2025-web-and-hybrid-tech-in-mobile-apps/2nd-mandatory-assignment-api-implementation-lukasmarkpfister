const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// ------ WRITE YOUR SOLUTION HERE BELOW ------//

const JWT_SECRET = "webtokenasdfj";
const users = [];
const highScores = [];

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send();
  }
  const token = authHeader.split(" ")[1];
  if (token !== JWT_SECRET) {
    return res.status(401).send();
  }
  next();
};

app.post("/signup", (req, res) => {
  const { userHandle, password } = req.body;
  if (!userHandle || !password || userHandle.length < 6 || password.length < 6) {
    return res.status(400).send();
  }
  users.push({ userHandle, password });
  res.status(201).send();
});

app.post("/login", (req, res) => {
  const { userHandle, password } = req.body;
  if (!userHandle || !password || typeof userHandle !== "string" || typeof password !== "string") {
    return res.status(400).send();
  }
  if (Object.keys(req.body).length !== 2) {
    return res.status(400).send();
  }
  if (userHandle === "DukeNukem" && password === "123456") {
    return res.status(200).json({ jsonWebToken: JWT_SECRET });
  }
  res.status(401).send();
});

app.post("/high-scores", authenticateJWT, (req, res) => {
  const { level, userHandle, score, timestamp } = req.body;
  if (!level || !userHandle || !score || !timestamp) {
    return res.status(400).send();
  }
  if (typeof level !== "string" || typeof userHandle !== "string" || typeof score !== "number" || typeof timestamp !== "string") {
    return res.status(400).send();
  }
  highScores.push({ level, userHandle, score, timestamp });
  res.status(201).send();
});

app.get("/high-scores", (req, res) => {
  const { level, page = 1 } = req.query;
  if (!level) {
    return res.status(400).send("Level parameter is required");
  }
  const pageSize = 20;
  const levelScores = highScores.filter((score) => score.level === level);
  const sortedScores = levelScores.sort((a, b) => b.score - a.score);
  const startIndex = (parseInt(page) - 1) * pageSize;
  const endIndex = parseInt(page) * pageSize;
  const paginatedScores = sortedScores.slice(startIndex, endIndex);
  res.status(200).json(paginatedScores);
});

//------ WRITE YOUR SOLUTION ABOVE THIS LINE ------//

let serverInstance = null;
module.exports = {
  start: function () {
    serverInstance = app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  },
  close: function () {
    serverInstance.close();
  },
};