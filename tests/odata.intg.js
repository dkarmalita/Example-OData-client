import {expect} from 'chai';
import OdataClient from '../odata';

const o = new OdataClient({
  baseURL: 'http://services.odata.org/V4/TripPinService',
  timeout: 2000,
  headers: {'Content-Type': 'application/json'}
})

describe('odata.org/V4', function() {

    this.slow(3000);
    this.timeout(4000);

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

    describe('item CRUD', () => {

        const newPerson = {
            "UserName": '01-hoj'+Date.now(),
            "FirstName": "Miala",
            "LastName": "Thompson",
            "Gender": "Female"
        }

        it("create(setName, {...})", async ()=>{
            return o.item.create('/People', newPerson)
            .then( (x) => {
                return o.item.read('/People', newPerson['UserName'])
            })
            .then( (x) => {
                expect(x.data['LastName']).to.eql('Thompson');
            })
        })
        it("read(setName, numId)", async ()=>{
            return o.item.read('/Photos', 21)
            .then( (x) => {
                expect(x.data['Id']).to.eql(21)
            });
        })
        it("read(setName, strId)", async ()=>{
            return o.item.read('/People', 'clydeguess')
            .then( (x) => {
                expect(x.data['UserName']).to.eql('clydeguess')
            });
        })
        it("update(setName, id, {...})", async ()=>{
            const updatePerson = {
                "LastName": "Anderson"
            }
            return o.item.update('/People', newPerson['UserName'], updatePerson)
            .then( (x) => {
                return o.item.read('/People', newPerson['UserName'])
            })
            .then( (x) => {
                expect(x.data['LastName']).to.eql(updatePerson['LastName']);
            })
        })
        it("delete(setName, id)", async ()=>{
            return o.item.delete('/People', newPerson['UserName'])
            .then( (x) => {
                return o.asset.filter('/People', 'UserName', newPerson['UserName'])
            })
            .then( (x) => {
                //console.log(x.data.value.length);
                expect(x.data.value.length).to.eql(0);
            })
        })
    })

    describe('asset', ()=>{
        it("list(setName)", async ()=>{
            return o.asset.list('/Photos')
            .then( (x) => {
                expect(x.data.value.length).to.be.above(0)
            });
        })
        it("filter(setName, field, value)", async ()=>{
            return o.asset.filter('/People','FirstName', 'Clyde')
            .then( (x) => {
                expect(x.data.value.length).to.eql(1)
            });
        })
    })
})