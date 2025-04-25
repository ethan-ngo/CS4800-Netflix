import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUpPageNative from '../pages/SignUpPageNative';
import { Alert } from 'react-native';

global.fetch = jest.fn();
jest.spyOn(Alert, 'alert');

describe('SignUpPageNative', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fillInputs = (utils, { name, email, password, confirmPassword }) => {
    fireEvent.changeText(utils.getByPlaceholderText('Name'), name);
    fireEvent.changeText(utils.getByPlaceholderText('Email'), email);
    fireEvent.changeText(utils.getByPlaceholderText('Password'), password);
    fireEvent.changeText(utils.getByPlaceholderText('Confirm Password'), confirmPassword);
  };

  it('shows alert when fields are empty', async () => {
    const utils = render(<SignUpPageNative navigation={{ navigate: mockNavigate }} />);
    fireEvent.press(utils.getByTestId('signup-button'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
    });
  });

  it('shows alert when passwords do not match', async () => {
    const utils = render(<SignUpPageNative navigation={{ navigate: mockNavigate }} />);
    fillInputs(utils, {
      name: 'Ali',
      email: 'ali@gmail.com',
      password: 'pass123',
      confirmPassword: 'wrongpass',
    });

    fireEvent.press(utils.getByTestId('signup-button'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Passwords do not match');
    });
  });

  it('shows alert if email is already in use', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ email: 'ali@gmail.com' }],
    });

    const utils = render(<SignUpPageNative navigation={{ navigate: mockNavigate }} />);
    fillInputs(utils, {
      name: 'Ali',
      email: 'ali@gmail.com',
      password: 'pass123',
      confirmPassword: 'pass123',
    });

    fireEvent.press(utils.getByTestId('signup-button'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Email is already in use');
    });
  });

  it('shows alert if email check fails (network error)', async () => {
    fetch.mockRejectedValueOnce(new Error('network error'));

    const utils = render(<SignUpPageNative navigation={{ navigate: mockNavigate }} />);
    fillInputs(utils, {
      name: 'Ali',
      email: 'ali@gmail.com',
      password: 'pass123',
      confirmPassword: 'pass123',
    });

    fireEvent.press(utils.getByTestId('signup-button'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to check email');
    });
  });

  it('shows alert if account creation fails', async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // email check
      .mockResolvedValueOnce({ ok: false, status: 500 }); // account creation

    const utils = render(<SignUpPageNative navigation={{ navigate: mockNavigate }} />);
    fillInputs(utils, {
      name: 'Ali',
      email: 'ali@gmail.com',
      password: 'pass123',
      confirmPassword: 'pass123',
    });

    fireEvent.press(utils.getByTestId('signup-button'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to create account');
    });
  });

  it('signs up successfully and navigates to login', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      }) // email check
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ userID: 'abc123' }),
      }); // create user

    const utils = render(<SignUpPageNative navigation={{ navigate: mockNavigate }} />);
    fillInputs(utils, {
      name: 'Ali',
      email: 'ali@gmail.com',
      password: 'pass123',
      confirmPassword: 'pass123',
    });

    fireEvent.press(utils.getByTestId('signup-button'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Account created successfully');
      expect(mockNavigate).toHaveBeenCalledWith('Login');
    });
  });
});
