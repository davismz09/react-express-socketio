import io from "socket.io-client";
import {useState, useEffect} from "react";

const socket = io("/");

export default function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message === "") return;
    setMessages((state) => [...state, {from: "Me", body: message}]);
    socket.emit("message", message);
    setMessage("");
  };

  useEffect(() => {
    socket.on("message", receiveMessage);
    return () => socket.off("message", receiveMessage);
  }, []);

  const receiveMessage = (message) =>
    setMessages((state) => [...state, message]);

  return (
    <div className='fixed bottom-0 right-0 left-0 bg-gray-800 border-t border-gray-600 flex flex-col h-full text-white'>
      <div className='flex-grow overflow-y-auto'>
        <ul className='flex flex-col items-start px-5'>
          {messages.map((message, index) => (
            <li
              key={index}
              className={`p-3 rounded-lg my-2 max-w-xs ${
                message.from === "Me"
                  ? "bg-green-600 text-white self-end"
                  : "bg-gray-700 text-white"
              }`}>
              <span className='block text-xs font-semibold'>
                {message.from}
              </span>
              <span className='block mt-1'>{message.body}</span>
            </li>
          ))}
        </ul>
      </div>
      <form
        onSubmit={handleSubmit}
        className='p-3 border-t border-gray-600 flex items-center bg-gray-900'>
        <input
          type='text'
          className='flex-grow border border-gray-600 rounded-lg px-4 py-2 mr-2 focus:outline-none bg-gray-800 text-white'
          placeholder='Write your message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type='submit'
          className='bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none'>
          Send
        </button>
      </form>
    </div>
  );
}
