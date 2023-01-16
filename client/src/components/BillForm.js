import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { default as ReactSelect } from 'react-select';
import Option from './Option.js';

const InitialForm = {
  label: '',
  icon: '',
};

export default function BillForm() {
  const logged_user = useSelector((state) => state.auth.user);
  const token = Cookies.get('token');
  const [form, setForm] = useState(InitialForm);
  const [data, setData] = useState([]);

  async function getUserList() {
    const token = Cookies.get('token');
    const res = await fetch(`${process.env.REACT_APP_API_URL}/user/all`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const users = await res.json();
    setData(users);
  }

  useEffect(() => {
    getUserList();
  }, []);

  function generateOptions() {
    let user_list = data.all_users || [];
    let final_list = [];
    user_list.forEach((user) => {
      if (user._id != logged_user._id) {
        let data = {
          value: user._id,
          label: user.email,
        };
        final_list.push(data);
      }
    });
    return final_list;
  }

  async function create() {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/split`, {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Successfully updated.');
    } catch (error) {
      alert('Failed to create a bill');
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleDropdown(newValue) {
    setForm({ ...form, userList: newValue });
  }

  function handleDate(newValue) {
    setForm({ ...form, date: newValue });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    create();
  }

  const colourOptions = generateOptions();

  return (
    <Container>
      <Card sx={{ minWidth: 275, marginTop: 10 }}>
        <CardContent sx={{ height: 175, position: 'absolute' }}>
          <Typography variant='h4'>Bills Split</Typography>
          <Typography variant='h6'>Add New Transaction</Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{ display: 'flex' }}
          >
            <TextField
              sx={{ marginRight: 5 }}
              id='outlined-basic'
              label='Amount'
              type='number'
              size='small'
              name='amount'
              variant='outlined'
              value={form.amount}
              onChange={handleChange}
            />
            <TextField
              sx={{ marginRight: 5 }}
              id='outlined-basic'
              label='Description'
              size='small'
              name='description'
              variant='outlined'
              value={form.description}
              onChange={handleChange}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label='Transaction Date'
                inputFormat='MM/DD/YYYY'
                value={form.date}
                onChange={handleDate}
                renderInput={(params) => (
                  <TextField sx={{ marginRight: 5 }} size='small' {...params} />
                )}
              />
            </LocalizationProvider>

            <div style={{ width: 300 }}>
              <ReactSelect
                options={colourOptions}
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{
                  Option,
                }}
                onChange={handleDropdown}
                allowSelectAll={true}
                value={form.optionSelected}
              />
            </div>

            <Button
              type='submit'
              variant='contained'
              style={{ marginLeft: 20, position: 'absolute', left: 1100 }}
            >
              Submit
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
