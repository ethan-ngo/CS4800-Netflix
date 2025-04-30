// tests/ForgotPasswordNative.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ForgotPasswordNative from '../pages/ForgotPasswordNative';
import { Alert } from 'react-native';

jest.spyOn(Alert, 'alert');
global.fetch = jest.fn();

describe('ForgotPasswordNative', () => {
  const navigation = { navigate: jest.fn() };
  const validEmail = 'ali@gmail.com';
  const validId = '67da15550b51479308f72a7b';
  const validToken = '46a184017a11b1aa71cd64a346e4ce7a3c405f41';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('alerts if fetching users fails', async () => {
    fetch.mockRejectedValueOnce(new Error('network down'));
    const { getByText, getByPlaceholderText } = render(
      <ForgotPasswordNative navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), validEmail);
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to fetch users.');
    });
  });

  it("alerts when email doesn't exist", async () => {
    // first fetch (list users)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    const { getByPlaceholderText, getByText } = render(
      <ForgotPasswordNative navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), validEmail);
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', `${validEmail} doesn't exist.`);
    });
  });

  it('handles send-email success and shows token form', async () => {
    // fetch users -> returns one match
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ email: validEmail, _id: validId }],
      })
      // send-email patch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: validId }),
      });

    const { getByPlaceholderText, getByText, queryByPlaceholderText } = render(
      <ForgotPasswordNative navigation={navigation} />
    );

    // before submitting, token input not present
    expect(queryByPlaceholderText('Token')).toBeNull();

    fireEvent.changeText(getByPlaceholderText('Email'), validEmail);
    fireEvent.press(getByText('Submit'));

    // after success, form rerenders with token input
    await waitFor(() => {
      expect(getByText(`An email with the token has been sent to ${validEmail}.`)).toBeTruthy();
      expect(getByPlaceholderText('Token')).toBeTruthy();
    });
  });

  it('alerts if send-email fails', async () => {
    // fetch users -> one match
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ email: validEmail, _id: validId }],
    });
    // send-email throws
    fetch.mockRejectedValueOnce(new Error('patch failed'));

    const { getByPlaceholderText, getByText } = render(
      <ForgotPasswordNative navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), validEmail);
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to send email.');
    });
  });

  it('navigates on valid token', async () => {
    // email flow
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ email: validEmail, _id: validId }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: validId }),
      })
      // token validation
      .mockResolvedValueOnce({ ok: true });

    const { getByPlaceholderText, getByText } = render(
      <ForgotPasswordNative navigation={navigation} />
    );

    // submit email
    fireEvent.changeText(getByPlaceholderText('Email'), validEmail);
    fireEvent.press(getByText('Submit'));
    await waitFor(() => getByPlaceholderText('Token'));

    // enter & submit token
    fireEvent.changeText(getByPlaceholderText('Token'), validToken);
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith('ResetPassword', {
        _id: validId,
        email: validEmail,
      });
    });
  });

  it('alerts on invalid token', async () => {
    // email flow
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ email: validEmail, _id: validId }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: validId }),
      })
      // token validation returns 400
      .mockResolvedValueOnce({ ok: false });

    const { getByPlaceholderText, getByText } = render(
      <ForgotPasswordNative navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), validEmail);
    fireEvent.press(getByText('Submit'));
    await waitFor(() => getByPlaceholderText('Token'));

    fireEvent.changeText(getByPlaceholderText('Token'), 'bad-token');
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Invalid token.');
      expect(navigation.navigate).not.toHaveBeenCalledWith('ResetPassword', expect.anything());
    });
  });

  it('alerts if token validation throws', async () => {
    // email flow
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ email: validEmail, _id: validId }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: validId }),
      })
      // throw on validate-token
      .mockRejectedValueOnce(new Error('server down'));

    const { getByPlaceholderText, getByText } = render(
      <ForgotPasswordNative navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), validEmail);
    fireEvent.press(getByText('Submit'));
    await waitFor(() => getByPlaceholderText('Token'));

    fireEvent.changeText(getByPlaceholderText('Token'), validToken);
    fireEvent.press(getByText('Submit'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to validate token.');
    });
  });
});
