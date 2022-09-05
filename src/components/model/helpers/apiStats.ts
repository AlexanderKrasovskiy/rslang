import { HOST } from './apiHelpers';
import { Method, Path } from '../../types';
import { Stats } from '../../types/statsTypes';

export const getUserStats = async (userId: string, token: string) => {
  const url = `${HOST}${Path.users}/${userId}${Path.statistics}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { ok, status } = res;
  let stats: Stats | undefined;
  if (ok) {
    stats = (await res.json()) as Stats;
  }

  return { ok, code: status, stats };
};

export const postUserStats = async (userId: string, token: string, newStats: Stats) => {
  const url = `${HOST}${Path.users}/${userId}${Path.statistics}`;
  const res = await fetch(url, {
    method: Method.update,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newStats),
  });

  const data = (await res.json()) as Stats;
  return data;
};
