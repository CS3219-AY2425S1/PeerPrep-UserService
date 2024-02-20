import http from "http";
import index from "./index.js";
import "dotenv/config";

const port = process.env.PORT || 3001;

const server = http.createServer(index);

console.log("Starting on Port:", port);

server.listen(port);
