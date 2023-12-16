import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import './App.css';
import {
  KeyboardDoubleArrowRightOutlined,
  KeyboardDoubleArrowLeftOutlined,
  KeyboardDoubleArrowUpOutlined,
  ArrowDownward,
} from '@mui/icons-material';

function App() {
  const [position, setPosition] = useState(0);
  const [rightPwm, setRightPwm] = useState(0);
  const [leftPwm, setLeftPwm] = useState(0);
  const [sensorData, setSensorData] = useState(Array(8).fill(false));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.1.85:8080/api/subscribe');
        const { position, rightPwm, leftPwm, sensor } = response.data;

        setPosition(position);
        setRightPwm(rightPwm);
        setLeftPwm(leftPwm);
        setSensorData(sensor);
      } catch (error) {
        console.error('Backend ile iletişim hatası:', error);
      }
    };

    const interval = setInterval(fetchData, 250);

    return () => clearInterval(interval);
  }, []);

  const getDirection = () => {
    if (leftPwm > rightPwm) {
      return 1;
    } else if (rightPwm > leftPwm) {
      return 2;
    } else {
      return 0;
    }
  };

  const renderDirectionIcon = () => {
    const direction = getDirection();

    switch (direction) {
      case 0:
        return <KeyboardDoubleArrowUpOutlined style={{ fontSize: '5rem'}}  />;
      case 1:
        return <KeyboardDoubleArrowRightOutlined style={{ fontSize: '5rem'}} />;
      case 2:
        return <KeyboardDoubleArrowLeftOutlined  style={{ fontSize: '5rem'}} />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <Box mt={2}>
        <Typography variant="h4">QTR ROBOT</Typography>
        <IconButton color="primary" size="large">
          {renderDirectionIcon()}
        </IconButton>
      </Box>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        {sensorData.map((status, index) => (
          <div
            key={index}
            style={{
              width: '30px',
              height: '30px',
              border: '3px solid #D5BF86',
              margin: '0 5px',
              backgroundColor: status ? 'black' : 'white',
            }}
          ></div>
        ))}
      </div>

      <Paper elevation={3} style={{ padding: '20px', width: '600px', textAlign: 'center', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>
        </Typography>
        <TableContainer className="TableContainer" component={Paper}>
          <Table>
            <TableHead className="TableHead">
              <TableRow>
                <TableCell className="TableCell">Position</TableCell>
                <TableCell className="TableCell">Right PWM</TableCell>
                <TableCell className="TableCell">Left PWM</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className="TableCell">{position}</TableCell>
                <TableCell className="TableCell">{rightPwm}</TableCell>
                <TableCell className="TableCell">{leftPwm}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

export default App;
