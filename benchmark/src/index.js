import axios from "axios";

const response = await axios.get("http://localhost:3000/api/ping");

console.log(response.data);
