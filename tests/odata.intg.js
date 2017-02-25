import {expect} from 'chai';
import OdataClient from '../odata';

const o = new OdataClient({
  baseURL: 'http://services.odata.org/V4/TripPinService',
  timeout: 2000,
  headers: {'Content-Type': 'application/json'}
})

describe('odata.org/V4', ()=>{
    const newPerson = {
        "UserName": '01-hoj'+Date.now(),
        "FirstName": "Miala",
        "LastName": "Thompson",
        "Gender": "Female"
    }

    it("getRoot()", async ()=>{
        return o.getRoot()
        .then( (x) => {
            expect(x.data.value).to.eql(
                [ 
                 { name: 'Photos', kind: 'EntitySet', url: 'Photos' },
                 { name: 'People', kind: 'EntitySet', url: 'People' },
                 { name: 'Airlines', kind: 'EntitySet', url: 'Airlines' },
                 { name: 'Airports', kind: 'EntitySet', url: 'Airports' },
                 { name: 'Me', kind: 'Singleton', url: 'Me' },
                 { name: 'GetNearestAirport',
                   kind: 'FunctionImport',
                   url: 'GetNearestAirport' } 
                ]
            )
        });
    })
    it("listSet(setName)", async ()=>{
        return o.listSet('/Photos')
        .then( (x) => {
            expect(x.data.value.length).to.be.above(0)
        });
    })
    it("getItem(setName, numId)", async ()=>{
        return o.getItem('/Photos', 21)
        .then( (x) => {
            expect(x.data['Id']).to.eql(21)
        });
    })
    it("getItem(setName, strId)", async ()=>{
        return o.getItem('/People', 'clydeguess')
        .then( (x) => {
            expect(x.data['UserName']).to.eql('clydeguess')
        });
    })
    it("filterSet(setName, field, value)", async ()=>{
        return o.filterSet('/People','FirstName', 'Clyde')
        .then( (x) => {
            expect(x.data.value.length).to.eql(1)
        });
    })
    it("addItem(setName, {...})", async ()=>{
        return o.addItem('/People', newPerson)
        .then( (x) => {
            return o.getItem('/People', newPerson['UserName'])
        })
        .then( (x) => {
            expect(x.data['LastName']).to.eql('Thompson');
        })
    })
    it("updateItem(setName, {...})", async ()=>{
        const updatePerson = {
            "LastName": "Anderson"
        }
        return o.updateItem('/People', newPerson['UserName'], updatePerson)
        .then( (x) => {
            return o.getItem('/People', newPerson['UserName'])
        })
        .then( (x) => {
            expect(x.data['LastName']).to.eql(updatePerson['LastName']);
        })
    })
    it("deleteItem(setName, id)", async ()=>{
        return o.deleteItem('/People', newPerson['UserName'])
        .then( (x) => {
            return o.filterSet('/People', 'UserName', newPerson['UserName'])
        })
        .then( (x) => {
            //console.log(x.data.value.length);
            expect(x.data.value.length).to.eql(0);
        })
    })
})