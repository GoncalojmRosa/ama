import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { GetRoomMessagesResponse } from "../http/get-room-messages";

interface UseMessagesWebsocketsParams {
  roomId: string;
}

type WebhookMessage =
  | {
      kind: "message_created";
      value: {
        id: string;
        text: string;
        reaction_count: number;
        answered: boolean;
      };
    }
  | {
      kind: "message_answered";
      value: {
        id: string;
      };
    }
  | {
      kind: "message_reaction_increased" | "message_reaction_decreased";
      value: {
        id: string;
        count: number;
      };
    };
export function useMessageWebSockets({ roomId }: UseMessagesWebsocketsParams) {
  const queryClient = useQueryClient();
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomId}`);
    ws.onopen = () => {
      console.log("connected");
    };

    ws.onclose = () => {
      console.log("disconnected");
    };

    ws.onmessage = (event) => {
      const data: WebhookMessage = JSON.parse(event.data);
      switch (data.kind) {
        case "message_created": {
          queryClient.setQueryData<GetRoomMessagesResponse>(
            ["messages", { roomId }],
            (oldData) => {
              return {
                messages: [
                  ...(oldData?.messages ?? []),
                  {
                    id: data.value.id,
                    text: data.value.text,
                    amountOfReactions: data.value.reaction_count,
                    answered: data.value.answered,
                  },
                ],
              };
            }
          );
          break;
        }
        case "message_answered": {
          queryClient.setQueryData<GetRoomMessagesResponse>(
            ["messages", { roomId }],
            (oldData) => {
              if (!oldData) {
                return undefined;
              }
              return {
                messages: oldData?.messages.map((message) => {
                  if (message.id === data.value.id) {
                    return {
                      ...message,
                      answered: true,
                    };
                  }
                  return message;
                }),
              };
            }
          );
          break;
        }
        case "message_reaction_increased":
        case "message_reaction_decreased": {
          queryClient.setQueryData<GetRoomMessagesResponse>(
            ["messages", { roomId }],
            (oldData) => {
              if (!oldData) {
                return undefined;
              }
              return {
                messages: oldData?.messages.map((message) => {
                  if (message.id === data.value.id) {
                    return {
                      ...message,
                      amountOfReactions: data.value.count,
                    };
                  }
                  return message;
                }),
              };
            }
          );
          break;
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [roomId, queryClient]);
}
