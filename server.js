const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Server is running OK");
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
