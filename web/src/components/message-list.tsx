import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useMessageWebSockets } from "../hooks/use-message-websocket";
import { getRoomMessages } from "../http/get-room-messages";
import Message from "./message";

export function MessageList() {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    throw new Error("Message List component must be used within room page");
  }

  // const { messages } = use(getRoomMessages({ roomId }));

  const { data } = useSuspenseQuery({
    queryKey: ["messages", { roomId }],
    queryFn: () => getRoomMessages({ roomId }),
  });

  useMessageWebSockets({ roomId });

  const sortedMessages = data.messages.sort((a, b) => {
    return b.amountOfReactions - a.amountOfReactions;
  });

  return (
    <ol className="list-decimal list-outside px-3 space-y-8">
      {sortedMessages.map((message) => (
        <Message
          key={message.id}
          id={message.id}
          text={message.text}
          amountOfReactions={message.amountOfReactions}
          answered={message.answered}
        />
      ))}
    </ol>
  );
}
