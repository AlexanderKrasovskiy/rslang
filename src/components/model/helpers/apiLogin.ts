import { HOST } from './apiHelpers';
import { Path, User, Method } from '../../types';
import { LoginData, RefreshResponse, AuthResponse, CreateResponse } from '../../types/loginTypes';

export const refreshToken = async (user: LoginData) => {
  const url = `${HOST}${Path.users}/${user.id}${Path.tokens}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${user.refreshToken}`,
    },
  });

  const { ok, status } = res;
  let data: RefreshResponse | undefined;
  if (ok) {
    data = (await res.json()) as RefreshResponse;
  }

  return { ok, status, data };
};

export const createUser = async (user: User) => {
  const url = `${HOST}${Path.users}`;
  const res = await fetch(url, {
    method: Method.create,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  const { ok, status } = res;
  let data: CreateResponse | undefined;
  if (ok) {
    data = (await res.json()) as CreateResponse;
  }

  return { ok, status, data };
};

export const logUserIn = async (user: User) => {
  const url = `${HOST}${Path.signin}`;
  const res = await fetch(url, {
    method: Method.create,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  const { ok, status } = res;
  let data: AuthResponse | undefined;
  if (ok) {
    data = (await res.json()) as AuthResponse;
  }

  return { ok, status, data };
};
