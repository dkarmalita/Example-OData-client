/**
 * Tag list
 * ========
 * v0.1.0 - simple class
 *
 * Features
 * ========
 * [x] item CRUD 
 * [ ] $count
 * [ ] $filter (see todo/Specifications for details)
 * [ ] $select
 * [ ] $top
 * [ ] $skip
 * [ ] $orderby
 * [ ] $expand
 * 
 * Main Course
 * ===========
 * [x] migration to axios
 * [x] get (filter)
 * [x] get (select)
 * [x] patch (update)
 * [x] delete (delete)
 * [x] move the client to separate file
 * [x] covet with intg tests
 * [x] incapsulate class
 * [x] pick out an abstract method filterOff to work with any filter
 * [.] move to item/set & CRUD/others scheme
 * [ ] add valueOf method
 *
 * Special cases
 * =============
 * [x] ETag support
 * [x] string and numeric id are acceptable both
 * [ ] type(?) err on `return getList('/People','Gender','Male')`
 */
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';

const findID = (id) => typeof(id)=='string'?`('${id}')`:`(${id})`;
const filter = (field, operand, value) => `?$filter=${field} ${operand} ` + (typeof(value)=='string'?`'${value}'`:`${value}`);
const eTagHeader = (tag = '*') => {return {headers: { 'If-Match': tag }}}

export default class OdataClient {
    constructor(config = {}) {
        this.axios = axios.create(config);
        this.axios.defaults.adapter = httpAdapter;
    };
    item = {
        create: async (setName, data) => await this.axios.post(setName, data),
        read: async (setName, id) => await this.axios.get(setName+findID(id)),
        update: async (setName, id, data, tag = '*') => await this.axios.patch(setName+findID(id), data, eTagHeader(tag)),
        delete: async (setName, id, tag = '*') => await this.axios.delete(setName+findID(id), eTagHeader(tag))
    };
    asset = {
        filter: async (setName, field, value, operand='eq') => await this.axios.get(setName+filter(field, operand, value)),
        list: async (setName) => await this.axios.get(setName),
    };
    getRoot = async (setName) => await this.asset.list('/');
}