/**
 * Main Course
 * ===========
 * [x] migration to axios
 * [x] get (filter)
 * [x] get (select)
 * [x] patch (update)
 * [x] delete (delete)
 * [x] move the client to separate file
 *
 * Special cases
 * =============
 * [x] ETag support
 * [x] string and numeric id are acceptable both
 * [ ] err on `return getList('/People','Gender','Male')`
 */
import colors from 'colors';
import o from './odata';

// <---------------------->

const onResolve = (x) => console.log(`resolved: ${x.status}\n`.magenta,x.data);
const onReject = (x) => console.log(`rejected: ${x.response.status} - ${x.message}`.red);

const test = async () => {

    //ok return o.getRoot();
    //ok return o.getRoot('/Photos');
    //ok return o.getItem('/Photos', 21)
    //ok return o.getItem('/People', 'clydeguess')
    //ok return o.getList('/People','FirstName', 'Clyde')

    const newPerson = {
        "UserName": '01-hoj'+Date.now(),
        "FirstName": "Miala",
        "LastName": "Thompson",
        "Gender": "Female"
    }
    //ok return o.addItem('/People', newPerson)

    const updatePerson = {
        "LastName": "Anderson"
    }
    //ok return o.updateItem('/People', '01-hoj1487962426694', updatePerson)

    const createAndUpdate = async () => {
        let xid;
        return await o.addItem('/People', newPerson)
        .then( x => {
                xid = x.data['UserName'];
                console.log(`created: ${x.status}`.blue, x.data['UserName'])
                return o.updateItem('/People', x.data['UserName'], updatePerson)
            }
            ,(x) => console.log(`rejected: ${x.response.status} - ${x.message}`.red)
        )
        .then( x => {
                console.log(`updated: ${x.status}`.blue, xid)
                return o.getList('/People','UserName', xid)
            }
            ,(x) => console.log(`rejected: ${x.response.status} - ${x.message}`.red)
        ) 
    }
    //ok return createAndUpdate();

    //ok return o.deleteItem('/People','01-hoj1487971391235')
    //ok return o.getList('/People','FirstName', 'Miala')
    
    const createAndUpdateAndDelete = async () => {
        let xid;
        return await o.addItem('/People', newPerson)
        .then( x => {
                xid = x.data['UserName'];
                console.log(`created: ${x.status}:`.blue, xid)
                return o.updateItem('/People', x.data['UserName'], updatePerson)
            }
            ,(x) => console.log(`rejected: ${x.response.status} - ${x.message}`.red)
        )
        .then( x => {
                console.log(`updated: ${x.status}:`.blue, xid)
                return o.deleteItem('/People', xid)
            }
            ,(x) => console.log(`rejected: ${x.response.status} - ${x.message}`.red)
        )
        .then( x => {
                console.log(`deleted: ${x.status}:`.blue, xid)
                return o.getList('/People','UserName', xid)
            }
            ,(x) => console.log(`rejected: ${x.response.status} - ${x.message}`.red)
        ) 
    }
    //ok 
    return createAndUpdateAndDelete()

}

test().then(onResolve, onReject);