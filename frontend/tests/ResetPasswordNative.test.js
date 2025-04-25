import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ResetPasswordNative from '../pages/ResetPasswordNative';

global.fetch = jest.fn();

describe('ResetPasswordNative', () => {
  const mockNavigate = jest.fn();
  const route = {
    params: {
      _id: '67da15550b51479308f72a7b',
      email: 'ali@gmail.com',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows nothing if passwords are empty or do not match', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ResetPasswordNative navigation={{ navigate: mockNavigate }} route={route} />
    );

    fireEvent.changeText(getByPlaceholderText('Password'), 'newPassword123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'differentPassword');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('does not call fetch if one of the fields is empty', async () => {
    const { getByPlaceholderText, getByText } = render(
      <ResetPasswordNative navigation={{ navigate: mockNavigate }} route={route} />
    );

    fireEvent.changeText(getByPlaceholderText('Password'), '');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), '');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('submits correct data and navigates to Login on success', async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    const { getByPlaceholderText, getByText } = render(
      <ResetPasswordNative navigation={{ navigate: mockNavigate }} route={route} />
    );

    fireEvent.changeText(getByPlaceholderText('Password'), 'newPassword123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'newPassword123');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('users/67da15550b51479308f72a7b'),
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: 'newPassword123' }),
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('Login');
    });
  });

  it('handles server error gracefully', async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const { getByPlaceholderText, getByText } = render(
      <ResetPasswordNative navigation={{ navigate: mockNavigate }} route={route} />
    );

    fireEvent.changeText(getByPlaceholderText('Password'), 'newPassword123');
    fireEvent.changeText(getByPlaceholderText('Confirm Password'), 'newPassword123');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
