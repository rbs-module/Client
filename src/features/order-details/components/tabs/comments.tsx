import { useState, useEffect, useRef } from "react";
import {
  Avatar,
  TextField,
  IconButton,
  Paper,
  Box,
  Typography,
  Stack,
  Divider,
  Tooltip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { OrderHistoryType } from "@/zod-schemas/orders/history";
import { useFetchMeQuery } from "@/services/user";
import { format } from "date-fns";
import getRelativeTime from "@/utils/relativeTime";

import RefreshLoading from "@/components/Loading/RefreshLoading";
import { useAddCommentsMutation } from "@/services/orders";
import SimpleBar from "simplebar-react";
import useOrderComments from "../../hooks/useOrderComments";

const ChatComponent = () => {
  const { comments, isFetching, orderId } = useOrderComments();
  const [input, setInput] = useState("");
  const { data: user } = useFetchMeQuery("");
  const [create] = useAddCommentsMutation();

  // Create a ref for the SimpleBar scrollable container
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chatContainerRef = useRef<any>(null);

  // Function to handle sending a message
  const handleSend = () => {
    if (input.trim()) {
      create({ orderId, formData: { comments: input } });
      setInput("");
    }
  };

  // Check if the comment belongs to the current user
  const isMyComments = (history: OrderHistoryType) => {
    return history.modified_by?.id === user?._id;
  };

  // Auto-scroll to the bottom whenever comments change
  useEffect(() => {
    scrollToEnd();
  }, [comments]); // Triggered whenever `comments` changes

  // Function to scroll to the bottom of the chat
  const scrollToEnd = () => {
    if (chatContainerRef.current) {
      const scrollElement = chatContainerRef.current.getScrollElement();
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  return (
    <Box height={"calc(100vh - 150px)"} sx={{ overflow: "hidden" }}>
      {/* <Button onClick={scrollToEnd}>Scroll to End</Button> */}
      <SimpleBar
        ref={chatContainerRef} // Attach the ref to SimpleBar
        style={{
          height: "calc(100vh - 150px)",
          overflow: "auto",
        }}
      >
        <Box sx={{ px: 2 }}>
          <RefreshLoading isLoading={isFetching} />
          {comments.map((history, index) => (
            <Box
              sx={{
                my: 5,
                display: "flex",
                flexDirection: isMyComments(history) ? "row-reverse" : "row",
              }}
              key={index}
            >
              <Tooltip arrow title={history.modified_by?.name}>
                <Avatar>{history.modified_by?.name[0]}</Avatar>
              </Tooltip>
              <Paper sx={{ p: 1, mx: 2 }}>
                <Typography sx={{ mb: 1, opacity: 0.3, fontSize: 9 }}>
                  {format(history.createdAt || "", "dd-MMM-yyyy")} |{" "}
                  {getRelativeTime(history?.createdAt || "")}
                </Typography>
                <Divider />
                <Typography>{history.message}</Typography>
              </Paper>
            </Box>
          ))}
          <Box height={50} /> {/* Spacer to ensure last message is visible */}
        </Box>
      </SimpleBar>

      {/* Input Box */}
      <Box
        sx={{
          position: "sticky",
          width: "100%",
          bottom: 0,
          p: 1,
          backdropFilter: "blur(10px)",
        }}
      >
        <Stack direction={"row"}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="mr-2"
          />
          <IconButton color="primary" onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default ChatComponent;
