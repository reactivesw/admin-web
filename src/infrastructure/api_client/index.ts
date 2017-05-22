import axios from 'axios'

const baseURL = process.env.ADMIN_API_URL

// Create a http client instance with some common settings
const httpClient = axios.create({
  baseURL: baseURL
})

export function formatError(apiError): string {
  let message: string

  // as described in https://github.com/mzabriskie/axios#handling-errors
  if (apiError.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    let response = apiError.response
    message = `Server error. Status: ${response.status}, 
      Data: ${response.data}, Headers: ${response.headers['errormessage']}`

  } else if (apiError.request) {
    message = `No response from server for request: ${apiError.request}`
  } else {
    message = `Http client error: ${apiError.message}`
  }

  return message
}

export default httpClient
