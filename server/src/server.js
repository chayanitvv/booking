require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB()
    .catch((error) => console.error(error.message))
    .finally(() => {
      app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    });
}

module.exports = app;