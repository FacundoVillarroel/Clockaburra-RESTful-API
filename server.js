const app = require("./api/index");
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running locally on port ${PORT}`);
});
