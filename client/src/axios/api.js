import axios from "axios";

const Api = axios.create({
  baseURL: process.env.PUBLIC_URL || 'http://localhost:5000'
})

export { Api };