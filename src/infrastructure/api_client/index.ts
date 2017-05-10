import axios from 'axios'

const baseURL = process.env.ADMIN_API_URL

// Create a http client instance with some common settings
const http = axios.create({
  baseURL: baseURL
})
export default http
