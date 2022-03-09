import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { Alert } from './components/Alert';

const Options = () => {
  const [color, setColor] = useState('');
  const [like, setLike] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsSnackbarOpen(false);
  };

  const saveOptions = () => {
    chrome.storage.sync.set(
      {
        favoriteColor: color,
        likesColor: like,
      },
      () => {
        setIsSnackbarOpen(true);
        // setStatus('Options saved.');

        // const id = setTimeout(() => {
        //   setStatus('');
        // }, 1000);

        // return () => clearTimeout(id);
      },
    );
  };

  const handleChangeColor = (event: SelectChangeEvent) => {
    const { value } = event.target;

    setColor(value);
  };

  const handleChangeLike = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;

    setLike(checked);
  };

  useEffect(() => {
    async function getConfiguration() {
      const store = await chrome.storage.sync.get(['favoriteColor', 'likesColor']);

      setColor(store.favoriteColor);
      setLike(store.likesColor);
    }

    getConfiguration();
  }, []);

  return (
    <>
      <CssBaseline />

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Configurações salvas!
        </Alert>
      </Snackbar>

      <Container maxWidth="sm" style={{ padding: 20 }}>
        <Box marginBottom={20}>
          <Stack direction="column" spacing={2}>
            <Typography variant="h6" color="#7159c1" component="span">
              Configurações
            </Typography>

            <FormControl fullWidth>
              <InputLabel id="color-label">Cor</InputLabel>

              <Select
                labelId="color-label"
                id="color"
                value={color}
                label="Age"
                onChange={handleChangeColor}
              >
                <MenuItem value="red">red</MenuItem>
                <MenuItem value="green">green</MenuItem>
                <MenuItem value="blue">blue</MenuItem>
                <MenuItem value="yellow">yellow</MenuItem>
              </Select>

              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={like} onChange={handleChangeLike} />}
                  label="Label"
                />
                {/* <FormControlLabel disabled control={<Checkbox />} label="Disabled" /> */}
              </FormGroup>
            </FormControl>

            {/* <IconButton>
              <CloseIcon />
            </IconButton> */}
          </Stack>
        </Box>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="flex-end"
          display="flex"
        >
          <Button onClick={saveOptions} variant="outlined" startIcon={<SaveIcon />}>
            Salvar
          </Button>
        </Stack>
      </Container>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById('root'),
);
