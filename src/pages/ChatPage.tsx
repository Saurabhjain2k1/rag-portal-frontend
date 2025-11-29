// src/pages/ChatPage.tsx
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { askChat } from "../api/chatApi";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await askChat(trimmed);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: res.answer,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box mb={2}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Chat
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ask questions about the documents ingested for your tenant.
        </Typography>
      </Box>

      {/* Chat card */}
      <Card
        sx={{
          mt: 2,
          mb: 2,
          height: "70vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
        }}
      >
        {/* Messages */}
        <CardContent
          sx={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: "#f5f6f8",
            px: 3,
          }}
        >
          {messages.length === 0 && (
            <Typography color="text.secondary" sx={{ mt: 5 }}>
              Start by asking a question about your documents…
            </Typography>
          )}

          {messages.map((m, i) => {
            const isUser = m.role === "user";

            return (
              <Box
                key={i}
                sx={{
                  mb: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isUser ? "flex-end" : "flex-start",
                }}
              >
                {/* Avatar + label */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                    flexDirection: isUser ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: isUser ? "#1e40af" : "#555",
                      width: 28,
                      height: 28,
                    }}
                  >
                    {isUser ? (
                      <PersonIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <SmartToyIcon sx={{ fontSize: 18 }} />
                    )}
                  </Avatar>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    {isUser ? "You" : "Bot"}
                  </Typography>
                </Box>

                {/* Bubble */}
                <Box
                  sx={{
                    maxWidth: "70%",
                    bgcolor: isUser ? "#e0e7ff" : "white",
                    color: "#111",
                    px: 2,
                    py: 1.5,
                    borderRadius: 3,
                    borderTopLeftRadius: isUser ? 16 : 4,
                    borderTopRightRadius: isUser ? 4 : 16,
                    boxShadow: 1,
                  }}
                >
                  <Typography variant="body2">{m.content}</Typography>
                </Box>
              </Box>
            );
          })}
        </CardContent>

        {/* Input area */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 1,
            alignItems: "center",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <TextField
            fullWidth
            placeholder="Ask something…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 100 }}
            onClick={handleSend}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Send"}
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default ChatPage;
