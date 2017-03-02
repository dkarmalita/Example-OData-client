/**
 * Tag list
 * ========
 * v0.1.0 - simple class
 *
 * Features
 * ========
 * [x] item CRUD 
 * [ ] OService.OSet(id).add
 * [ ] OService.OSet(id).OItem(id).read|update|delete

 * [ ] OService.OSet(id).OItem(id).Property
 * [ ] OService.OSet(id).OItem(id).OProperty(id).Value
 * [ ] OService.OSet(id).OItem(id).OProperty(id).Related
filter 
    []num|str|enum|nest 
    []logic 
    [] any|all
    [] build-in funcs
    [] sort
    [] expand related
    [] select props
    [] request full metadata
    [] casting types
    [] unbound functions
    [] bound functions
    [] bound actions

 * [ ] $count
 * [.] $filter (see todo/Specifications for details)
 *     [x] eq
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
 * [x] move to item/set & CRUD/others scheme
 * [x] review the naming
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

class OItems {  // crud 
    constructor(axios, setName){
        this.axios = axios;
        this.setName = setName;
    }
    async create(data) {
        return await this.axios.post(this.setName, data)
    }
    async read(id) {
        return await this.axios.get(this.setName+findID(id))
    }
    async update(id, data, tag = '*') {
        return await this.axios.patch(this.setName+findID(id), data, eTagHeader(tag))
    }
    async delete(id, tag = '*') {
        return await this.axios.delete(this.setName+findID(id), eTagHeader(tag))
    }
}

class OSet {    // set/array operations
    constructor(axios, setName){
        this.axios = axios;
        this.setName = setName;
    }    
    async filter(field, value, operand='eq') {
        return await this.axios.get(this.setName+filter(field, operand, value))
    }
    async list() {
        return await this.axios.get(this.setName);
    }
}

export default class OService {
    constructor(config = {}) {
        this.axios = axios.create(config);
        this.axios.defaults.adapter = httpAdapter;
    };
    items(setName) {
        return new OItems(this.axios, setName);
    };
    asset(setName) {
        return new OSet(this.axios, setName);
    };
    async getRoot() {
        return (new OSet(this.axios, '/')).list()
    };
    async getMetadata() {
        return (new OSet(this.axios, '/$metadata')).list()
    };
}

