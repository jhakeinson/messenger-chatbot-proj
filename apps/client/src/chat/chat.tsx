import { Avatar, Box, Button, Container, Grid, List, ListItem, ListItemIcon, ListItemText, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

interface Message {
  role: string;
  text: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
		{
          text: "Hello! I'm Neko. I'm your purrfect match. Raaawr!",
          role: "ai",
		},
	]);
  const [typing, setTyping] = useState(false); // TODO: [typing, setTyping  ] = useState(false);
  const [message, setMessage] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    const newHumanMessage = {
      text: message,
      role: 'human',
    };

    setMessages([...messages, newHumanMessage]);
    setTyping(true);

    axios.post('/api/chat', {
      message,
      history: messages,
    })
    .then(function (response) {
      const newMessage = {
        text: response.data.text,
        role: 'ai',
      };

      setTyping(false);
      setMessages([...messages, newHumanMessage, newMessage]);
    })
    .catch(function (error) {
      console.log(error);
    });
    
    setMessage("");
  };

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Container>
      <Grid container minHeight={'90vh'} direction={'column'} spacing={2}>
          <Grid item xs={12}>
            <Box ref={boxRef} sx={{ overflowY: "auto" }} height={'32rem'}>
              <List>
                  {messages.map((message, index) => (
                      <ListItem key={index}>
                          <ListItemIcon>
                              <Avatar src={
                                message.role === 'ai'
                                  ? 'https://upload.wikimedia.org/wikipedia/commons/4/4d/Profile_Picture_for_user_MereTechnicality_%281%29.png'
                                  : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'
                              } />
                          </ListItemIcon>
                          <ListItemText primary={
                            message.role === 'ai'
                              ? 'Catgirl Neko'
                              : 'You'
                          } secondary={message.text} />
                      </ListItem>
                  ))}
                  {typing && (
                    <ListItem>
                      <ListItemIcon>
                        <Avatar src='https://upload.wikimedia.org/wikipedia/commons/4/4d/Profile_Picture_for_user_MereTechnicality_%281%29.png' />
                      </ListItemIcon>
                      <ListItemText primary='Catgirl Neko' secondary='Purring...' />
                    </ListItem>
                  )}
              </List>
            </Box>
          </Grid>
          <Grid item mt={'auto'}>
              <TextField
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  label="Message"
                  variant="filled"
              />
              <Button fullWidth variant="contained" onClick={handleSendMessage}>
                  Send
              </Button>
          </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
