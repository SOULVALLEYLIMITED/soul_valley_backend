"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const PORT = process.env.PORT || 3000;
app_1.app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📄 Swagger documentation available at http://localhost:${PORT}/docs`);
});
