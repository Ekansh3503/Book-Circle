import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import UserBookList from './UserBookList';
import UserBorrowedList from './UserBorrowedList';
import UserReviewList from './UserReviewList';
import UserTransactionList from './UserTransactionList';


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function MyBooks() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }} className="bg-br-white rounded-xl">
      <Box sx={{ borderBottom: 3, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{ marginInline: '1rem' }} >
          <Tab
           sx={{
            fontFamily: 'Roboto, Sans-serif',
            fontWeight: '600',
            fontSize: '1.05rem',
            color: '#000000',
            textTransform: 'none',
           }}
           label="Book List" className='font-bold font-roboto' {...a11yProps(0)} />
          <Tab 
           sx={{
            fontFamily: 'Roboto, Sans-serif',
            fontWeight: '600',
            fontSize: '1.05rem',
            color: '#000000',
            textTransform: 'none',
           }} label="Borrowed" {...a11yProps(1)} />
          <Tab 
           sx={{
            fontFamily: 'Roboto, Sans-serif',
            fontWeight: '600',
            fontSize: '1.05rem',
            color: '#000000',
            textTransform: 'none',
           }} label="Reviews" {...a11yProps(2)} />
          <Tab 
           sx={{
            fontFamily: 'Roboto, Sans-serif',
            fontWeight: '600',
            fontSize: '1.05rem',
            color: '#000000',
            textTransform: 'none',
           }} label="Transactions" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UserBookList />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <UserBorrowedList />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <UserReviewList />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <UserTransactionList />
      </CustomTabPanel>
    </Box>
  );
}