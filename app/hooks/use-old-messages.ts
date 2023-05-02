import { useEffect, useState } from 'react'
import axios from 'axios'
import Message from '~/interfaces/message'

const useOldMessages = () => {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const get = async () => {
      const { data } = await axios.get<Message[]>('/api/messages')
      setMessages(data)
    }

    get()
  }, [])

  return messages
}

export default useOldMessages
