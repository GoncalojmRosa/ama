import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { createMessageReaction } from "../http/create-message-reaction";
import { toast } from "sonner";

interface MessageProps {
  id: string;
  answered?: boolean;
  amountOfReactions: number;
  text: string;
}

export default function Message({
  amountOfReactions,
  text,
  answered,
  id: messageId,
}: MessageProps) {
  const [hasReacted, setHasReacted] = useState(false);
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    throw new Error("Message List component must be used within room page");
  }

  async function createMessageReactionAction() {
    if (!roomId) {
      return;
    }
    try {
      await createMessageReaction({ roomId, messageId });
    } catch {
      toast.error("Failed to create message reaction");
    }
    setHasReacted(true);
  }

  async function removeMessageReactionAction() {
    if (!roomId) {
      return;
    }
    try {
      await createMessageReaction({ roomId, messageId });
    } catch {
      toast.error("Failed to remove message reaction");
    }
    setHasReacted(false);
  }

  return (
    <li
      data-answered={answered}
      className="ml-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:pointer-events-none"
    >
      {text}

      {hasReacted ? (
        <button
          type="button"
          onClick={removeMessageReactionAction}
          className="mt-3 flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-500"
        >
          <ArrowUp className="size-4" />
          Curtir pergunta ({amountOfReactions})
        </button>
      ) : (
        <button
          onClick={createMessageReactionAction}
          type="button"
          className="mt-3 flex items-center gap-2 text-zinc-400 text-sm font-medium hover:text-zinc-300"
        >
          <ArrowUp className="size-4" />
          Curtir pergunta ({amountOfReactions})
        </button>
      )}
    </li>
  );
}
