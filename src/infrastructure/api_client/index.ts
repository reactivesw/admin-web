import axios from 'axios'

const baseURL = process.env.ADMIN_API_URL

export interface ApiResult {
  data?: any
  error?: string
}

// Create a http client instance with some common settings
const instance = axios.create({
  baseURL: baseURL
})

// wrap the axios instance, to append a token to every request it sent.
const http: any = {}

const functionsWithoutData = ['get', 'delete', 'head']
const functionsWithData = ['post', 'put', 'patch']

functionsWithoutData.forEach((method) => {
  http[method] = async function (url, config) {
    let data: object | undefined = undefined
    let error: string | undefined  = undefined
    try {
      const response = await instance[method](url, config)
      data = response && response.data
    } 
    catch (apiError) {
      error = convertError(apiError)
    }
    return {data, error}
  }
})

functionsWithData.forEach((method) => {
  http[method] = async function (url, payload, config) {
    let data: object | undefined = undefined
    let error: string | undefined  = undefined
    try {
      let response = await instance[method](url, payload, config)
      data = response && response.data
    } 
    catch (apiError) {
      error = convertError(apiError)
    }
    return {data, error}
  }
})

function convertError(apiError): string {
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

export default http
