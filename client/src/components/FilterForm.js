import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../store/auth.js';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
const InitialForm = {
  label: '',
  icon: '',
};
var d = {
  data: [
    {
      _id: '',
      transactions: [
        {
          amount: '',
          description: '',
          date: '',
          category: '',
          _id: '',
        },
      ],
    },
  ],
};

const icons = ['User'];

export default function CategoryForm() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const token = Cookies.get('token');
  const [form, setForm] = useState(InitialForm);
  const [filters, setFilter] = useState([]);

  async function fetchFilterList() {
    const token = Cookies.get('token');
    console.log('Hello', JSON.stringify(form));
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/filter?priceCategory=${
        form.priceRadio
      }&category=${form.category.label || undefined}&sDate=${
        form.sDate
      }&eDate=${form.eDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Hey response', res);
    d = await res.json();
    console.log(`Response i ${JSON.stringify(d)}`);
    setFilter(d);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleStartDate(newValue) {
    setForm({ ...form, sDate: newValue });
  }

  function handleEndDate(newValue) {
    setForm({ ...form, eDate: newValue });
  }

  function handleCategory(newValue) {
    setForm({ ...form, category: newValue });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('qewqe');
    fetchFilterList();
  }

  function reload(res, _user) {
    if (res.ok) {
      dispatch(setUser({ user: _user }));
    }
  }

  function categoryName(name) {
    return name ? name.toUpperCase() : '';
  }

  function formatDate(date) {
    console.log(date);
    if (date == undefined) {
      return '';
    }
    return dayjs(date).format('DD MMM, YYYY');
  }

  const Categories = [
    { label: 'All' },
    { label: 'Travel' },
    { label: 'Shopping' },
    { label: 'Investment' },
    { label: 'Misc' },
  ];

  return (
    <Container>
      <Card sx={{ minWidth: 275, marginTop: 10 }}>
        <CardContent>
          <Typography variant='h4'>Filter</Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{ display: 'flex' }}
          >
            <div style={{ width: '200px' }}>
              <form>
                <Typography variant='h6'>Prices</Typography>
                <div className='radio'>
                  <label>
                    <input
                      type='radio'
                      value='option1'
                      name='priceRadio'
                      onChange={handleChange}
                    />
                    Less than 1000
                  </label>
                </div>
                <div className='radio'>
                  <label>
                    <input
                      type='radio'
                      value='option2'
                      name='priceRadio'
                      onChange={handleChange}
                    />
                    1000 - 5000
                  </label>
                </div>
                <div className='radio'>
                  <label>
                    <input
                      type='radio'
                      value='option3'
                      name='priceRadio'
                      onChange={handleChange}
                    />
                    5000 - 10000
                  </label>
                </div>
                <div className='radio'>
                  <label>
                    <input
                      type='radio'
                      value='option4'
                      name='priceRadio'
                      onChange={handleChange}
                    />
                    Greater than 10000
                  </label>
                </div>
              </form>
            </div>
            <div>
              <Typography
                variant='h6'
                sx={{ marginLeft: 10, paddingBottom: 2 }}
              >
                Categories
              </Typography>
              <Autocomplete
                value={JSON.stringify(form.category)}
                onChange={(event, newValue) => {
                  setForm({ ...form, category: newValue });
                }}
                options={Categories}
                sx={{ width: 200, marginLeft: 10 }}
                renderInput={(params) => (
                  <TextField {...params} size='small' label='Category' />
                )}
              />
            </div>
            <div>
              <Typography
                variant='h6'
                sx={{ marginLeft: 10, paddingBottom: 2 }}
              >
                Dates
              </Typography>
              <div style={{ marginLeft: 50, display: 'flex' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label='From Date'
                    inputFormat='MM/DD/YYYY'
                    value={form.sDate}
                    onChange={handleStartDate}
                    renderInput={(params) => (
                      <TextField
                        sx={{ marginRight: 5 }}
                        size='small'
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DesktopDatePicker
                    label='To Date'
                    inputFormat='MM/DD/YYYY'
                    value={form.eDate}
                    onChange={handleEndDate}
                    renderInput={(params) => (
                      <TextField
                        sx={{ marginRight: 5 }}
                        size='small'
                        {...params}
                      />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>

            <div
              style={{
                marginTop: '48px',
              }}
            >
              <Button type='submit' variant='contained'>
                Submit
              </Button>
            </div>
          </Box>
        </CardContent>
      </Card>
      <Typography sx={{ marginTop: 10 }} variant='h6'>
        List of Transactions
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell align='center'>Amount</TableCell>
              <TableCell align='center'>Description</TableCell>
              <TableCell align='center'>Category</TableCell>
              <TableCell align='center'>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {d.data.map((s) =>
              s.transactions.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align='center' component='th' scope='row'>
                    {row.amount}
                  </TableCell>
                  <TableCell align='center'>{row.description}</TableCell>
                  <TableCell align='center'>
                    {categoryName(row.category)}
                  </TableCell>
                  <TableCell align='center'>
                    {row.date ? formatDate(row.date) : ''}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
