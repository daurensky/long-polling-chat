import { FormEventHandler, useEffect, useState } from 'react'
import useNewMessages from '~/hooks/use-new-messages'
import useOldMessages from '~/hooks/use-old-messages'
import sendMessage from '~/utils/send-message'
import DebouncedInput from '~/components/debounced-input'
import classNames from 'classnames'

export const Index = () => {
  const oldMessages = useOldMessages()
  const newMessages = useNewMessages()
  const messages = [...oldMessages, ...newMessages].reverse()
  const [userName, setUserName] = useState('')
  const [messageText, setMessageText] = useState('')
  const [isUserNameError, setIsUserNameError] = useState(false)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault()
    setIsUserNameError(!Boolean(userName))
    if (userName && messageText) {
      setMessageText('')
      await sendMessage(userName, messageText)
    }
  }

  useEffect(() => {
    const localName = localStorage.getItem('user-name')
    localName && setUserName(localName)
  }, [])

  return (
    <main className="flex-grow flex">
      <section className="sm:py-8 flex-grow">
        <div className="max-w-screen-xl mx-auto w-full sm:px-4 h-full">
          <div className="max-w-screen-md w-full mx-auto h-full flex flex-col">
            <DebouncedInput
              debounceTime={200}
              debouncedOnChange={e =>
                localStorage.setItem('user-name', e.target.value)
              }
              type="text"
              placeholder="Введите имя"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              className={classNames(
                isUserNameError
                  ? 'placeholder:text-red-400'
                  : 'placeholder:text-secondary-main',
                'w-full bg-paper-main py-4 pl-4 pr-12 sm:rounded-t-2xl text-primary-main focus:outline-none border-b'
              )}
              tabIndex={-1}
            />

            <div className="flex-grow flex flex-col-reverse items-start gap-4 p-4 overflow-x-hidden overflow-y-auto h-0">
              {messages.map(({ _id, userName, text }) => (
                <div
                  key={_id}
                  className="rounded-2xl p-4 bg-paper-light flex flex-col gap-2"
                >
                  <span className="text-secondary-main text-sm">
                    {userName}
                  </span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex relative">
              <input
                type="text"
                placeholder="Введите сообщение"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                className="w-full placeholder:text-secondary-main bg-paper-main py-4 pl-4 pr-12 sm:rounded-2xl focus:outline-none"
                required
                autoFocus
              />
              <button className="absolute top-1/2 right-0 -translate-y-1/2 px-4 aspect-square rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary-main">
                  send
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Index
