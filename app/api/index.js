import { authenticatedRequest } from 'app/request';

export const getTransaskiBaru = () => 
  authenticatedRequest('/transaksi-baru', 'GET', null);


export const postTransaksiBaru = (data) => 
  authenticatedRequest('/transaksi-submit', 'POST', data);


export const ping = () => 
  authenticatedRequest('/ping', 'POST', null);
