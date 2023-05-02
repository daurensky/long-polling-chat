import axios, { AxiosError } from 'axios'

const sendMessage = async (userName: string, messageText: string) => {
  try {
    await axios.post('/api/publish', { userName, text: messageText })
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      console.log(e.response.status, e.response.data)
    }
  }
}

export default sendMessage
