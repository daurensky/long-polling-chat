import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import Message from '~/interfaces/message'

const useNewMessages = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    const subscribe = async () => {
      if (isSubscribed) {
        return
      }

      setIsSubscribed(true)

      try {
        const { data } = await axios.get('/api/subscribe', {
          timeout: 30_000,
        })

        setMessages(p => [...p, data])
        setIsSubscribed(false)
        await subscribe()
      } catch (e) {
        setIsSubscribed(false)

        if (!(e instanceof AxiosError)) {
          alert('Unknown error')
          await subscribe()
          return
        }

        if (e.code === 'ECONNABORTED') {
          await subscribe()
          return
        }

        if (e.response?.status === 502) {
          await subscribe()
          return
        }

        if (e.response && e.response.status > 200) {
          alert(e.response.status)
          await new Promise(resolve => setTimeout(resolve, 1000))
          await subscribe()
          return
        }

        await subscribe()
      }
    }

    subscribe()
  }, [])

  return messages
}

export default useNewMessages
