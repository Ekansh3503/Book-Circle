/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { loginUser } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Alert } from '@mui/material';

function LoginForm({ setUserId }) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError('Email field is empty');
      setShowError(true);
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      setShowError(true);
      return;
    }

    if (!password) {
      setError('Password field is empty');
      setShowError(true);
      return;
    }

    try {
      const data = await loginUser(email, password);
      if (data.userId && data.success) {
        setUserId(data.userId);
        console.log(data);
      }
    } catch (error) {
      console.log('error: ' + error);
      setError('Login failed. Please check your credentials.');
      setShowError(true);
    }
  };

  const handleResetPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className='flex flex-col justify-center px-28 w-full h-screen rounded-2xl bg-br-blue-light mt-4'>
      <p className='font-medium text-2xl text-br-blue-medium mt-4'>Welcome back!</p>
      <p className='font-medium text-md text-br-blue-medium pe-5'>
        Get access to the world of endless imagination.
      </p>

      {showError && (
        <div className='my-2'>
          <Alert variant='outlined' severity='error'>
            {error}
          </Alert>
        </div>
      )}

      <div>
        <div>
          <label className='text-md font-medium text-br-blue-medium'>Email</label>
          <input
            className='w-full bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1'
            placeholder='Email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className='mt-4'>
          <label className='text-md font-medium text-br-blue-medium'>Password</label>
          <div className='flex bg-white rounded-xl'>
            <input
              className='w-full bg-white text-br-blue-medium rounded-xl px-4 py-3 mt-1'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={show ? 'text' : 'password'}
            />
            <button className='p-4' onClick={handleClick} type='button'>
              {show ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </div>

        <div className='mt-4 flex flex-col gap-y-4'>
          <button
            className='py-3 rounded-xl cursor-pointer bg-br-blue-medium text-white text-md font-bold'
            onClick={submitHandler}
            type='button'
          >
            Sign In
          </button>
        </div>

        <button
          className='text-md text-br-blue-medium font-semibold mt-4 cursor-pointer'
          onClick={handleResetPassword}
        >
          Forgot Password? Reset Here
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
