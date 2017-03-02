import {expect} from 'chai';
import OService from '../odata';

const o = new OService({
  baseURL: 'http://services.odata.org/V4/TripPinService',
  timeout: 4000,
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

    it("getMetadata()", async ()=>{
        return o.getMetadata()
        .then( (x) => {
            expect(x).to.have.property('data');
            // can be parsed by a browser:
            // http://stackoverflow.com/a/17604312
        });
    })

    describe('items CRUD', () => {
        const newPerson = {
            "UserName": '01-hoj'+Date.now(),
            "FirstName": "Miala",
            "LastName": "Thompson",
            "Gender": "Female"
        }

        it("create(setName, {...})", async ()=>{
            return o.items('/People').create(newPerson)
            .then( (x) => {
                expect(x.status).to.eql(201)
                return o.items('/People').read(newPerson['UserName'])
            })
            .then( (x) => {
                expect(x.status).to.eql(200)
                expect(x.data['LastName']).to.eql('Thompson');
            })
        })
        it("read(setName, numId)", async ()=>{
            return o.items('/Photos').read(21)
            .then( (x) => {
                expect(x.status).to.eql(200)
                expect(x.data['Id']).to.eql(21)
            });
        })
        it("read(setName, strId)", async ()=>{
            return o.items('/People').read('clydeguess')
            .then( (x) => {
                expect(x.status).to.eql(200)
                expect(x.data['UserName']).to.eql('clydeguess')
            });
        })
        it("update(setName, id, {...})", async ()=>{
            const updatePerson = {
                "LastName": "Anderson"
            }
            return o.items('/People').update(newPerson['UserName'], updatePerson)
            .then( (x) => {
                expect(x.status).to.eql(204)
                return o.items('/People').read(newPerson['UserName'])
            })
            .then( (x) => {
                expect(x.status).to.eql(200)
                expect(x.data['LastName']).to.eql(updatePerson['LastName']);
            })
        })
        it("delete(setName, id)", async ()=>{
            return o.items('/People').delete(newPerson['UserName'])
            .then( (x) => {
                expect(x.status).to.eql(204)
                return o.asset('/People').filter('UserName', newPerson['UserName'])
            })
            .then( (x) => {
                expect(x.status).to.eql(200)
                expect(x.data.value.length).to.eql(0);
            })
        })
    })

    describe('asset', ()=>{
        it("filter(setName, field, value)", async ()=>{
            return o.asset('/People').filter('FirstName', 'Clyde')
            .then( (x) => {
                expect(x.status).to.eql(200)
                expect(x.data.value.length).to.eql(1)
            });
        })
        it("list(setName)", async ()=>{
            return o.asset('/Photos').list()
            .then( (x) => {
                expect(x.status).to.eql(200)
                expect(x.data.value.length).to.be.above(0)
            });
        })
    })

})