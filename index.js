/**
 * Main Course
 * ===========
 * [x] migration to axios
 * [x] get (filter)
 * [x] get (select)
 * [x] patch (update)
 * [x] delete (delete)
 *
 * Special cases
 * =============
 * [x] ETag support
 * [x] string and numeric id are acceptable both
 * [ ] err on `return getList('/People','Gender','Male')`
 */
import colors from 'colors';
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

// <---------------------->

const onResolve = (x) => console.log(`resolved: ${x.status}\n`.magenta,x.data);
const onReject = (x) => console.log(`rejected: ${x.response.status} - ${x.message}`.red);

const test = async () => {

    //ok return getRoot();
    //ok return getRoot('/Photos');
    //ok return getItem('/Photos', 21)
    //ok return getItem('/People', 'clydeguess')
    //ok return getList('/People','FirstName', 'Clyde')

    const newPerson = {
        "UserName": '01-hoj'+Date.now(),
        "FirstName": "Miala",
        "LastName": "Thompson",
        "Gender": "Female"
    }
    //ok return addItem('/People', newPerson)

    const updatePerson = {
        "LastName": "Anderson"
    }
    //ok return updateItem('/People', '01-hoj1487962426694', updatePerson)

    const createAndUpdate = async () => {
        let xid;
        return await addItem('/People', newPerson)
        .then( x => {
                xid = x.data['UserName'];
                console.log(`created: ${x.status}`.blue, x.data['UserName'])
                return updateItem('/People', x.data['UserName'], updatePerson)
            }
            ,(x) => console.log(`rejected: ${x.response.status} - ${x.message}`.red)
        )
        .then( x => {
                console.log(`updated: ${x.status}`.blue, xid)
                return getList('/People','UserName', xid)
            }
            ,(x) => console.log(`rejected: ${x.response.status} - ${x.message}`.red)
        ) 
    }
    //ok return createAndUpdate();

    //ok return deleteItem('/People','01-hoj1487963199352')
    //ok return getList('/People','FirstName', 'Miala')
    
    const createAndUpdateAndDelete = async () => {
        let xid;
        return await addItem('/People', newPerson)
        .then( x => {
                xid = x.data['UserName'];
                console.log(`created: ${x.status}:`.blue, xid)
                return updateItem('/People', x.data['UserName'], updatePerson)
            }
            ,(x) => console.log(`rejected: ${x.response.status} - ${x.message}`.red)
        )
        .then( x => {
                console.log(`updated: ${x.status}:`.blue, xid)
                return deleteItem('/People', xid)
            }
            ,(x) => console.log(`rejected: ${x.response.status} - ${x.message}`.red)
        )
        .then( x => {
                console.log(`deleted: ${x.status}:`.blue, xid)
                return getList('/People','UserName', xid)
            }
            ,(x) => console.log(`rejected: ${x.response.status} - ${x.message}`.red)
        ) 
    }
    //ok 
    return createAndUpdateAndDelete()

}

test().then(onResolve, onReject);