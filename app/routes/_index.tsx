import type { V2_MetaFunction } from "@remix-run/node";
import { FormEventHandler, useState } from "react";
import axios, { AxiosError } from "axios";
import useNewMessages from "~/hooks/use-new-messages";
import useOldMessages from "~/hooks/use-old-messages";

export const meta: V2_MetaFunction = () => {
  return [{ title: "Chat app" }];
};

export const Index = () => {
  const oldMessages = useOldMessages();
  const newMessages = useNewMessages();
  const [message, setMessage] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/publish", { message });
      setMessage("");
    } catch (e) {
      if (e instanceof AxiosError && e.response) {
        console.log(e.response.status, e.response.data);
      }
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label htmlFor="message">Message</label>
        <input
          type="text"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>Send message</button>
      </form>

      {oldMessages.map(({ _id, message }) => (
        <p key={_id}>{message}</p>
      ))}

      {newMessages.map((message, i) => (
        <p key={i}>{message}</p>
      ))}
    </main>
  );
};

export default Index;
