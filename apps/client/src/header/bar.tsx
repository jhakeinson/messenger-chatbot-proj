import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ChatIcon from '@mui/icons-material/Chat';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
              <ChatIcon 
                sx={{ mr: 2 }}
                fontSize='large'
              />

              <Typography variant="h6"  sx={{ flexGrow: 1 }}>
                  {title}
              </Typography>
            </Toolbar>
        </AppBar>
      </Box>
    );
};

export default Header;
