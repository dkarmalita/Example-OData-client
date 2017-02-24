import axios from 'axios';

const db = axios.create({
  baseURL: 'http://services.odata.org/V4/TripPinService',
  timeout: 1000,
  headers: {'Content-Type': 'application/json'}
});

const findID = (id) => typeof(id)=='string'?`('${id}')`:`(${id})`;
const filterEQ = (field,value) => `?$filter=${field} eq ` + (typeof(value)=='string'?`'${value}'`:`${value}`);
const eTagHeader = (tag = '*') => {return {headers: { 'If-Match': tag }}}

export const getRoot = async (setName = '/') => await db.get(setName);
export const getItem = async (setName, id) => await db.get(setName+findID(id));
export const getList = async (setName, field, value) => await db.get(setName+filterEQ(field,value));
export const addItem = async (setName, data) => await db.post(setName, data);
export const updateItem = async (setName, id, data, tag = '*') => await db.patch(setName+findID(id), data, eTagHeader(tag));
export const deleteItem = async (setName, id, tag = '*') => await db.delete(setName+findID(id), eTagHeader(tag));

export default {
    getRoot: getRoot,
    getItem: getItem,
    getList: getList,
    addItem: addItem,
    updateItem: updateItem,
    deleteItem: deleteItem
}
