/* This ide compile only one file so I have to use plain js and copy store class*/
// es6 option without rewriting class
//import Store  from '../scripts/store';


//Duplicated class from ../scripts/store
class Store {
  constructor() { 
    this.Store = window.localStorage;
  }
  createStore(name, data) {
    this.Store.setItem(name, data);
  }
  readStore(name) {
   return this.Store.getItem(name);
  }
}

// Tests
describe("Create store without blocking", function() {
  var store = new Store();
  
  //Create test store
  store.createStore("test","testdata");
     
  it("should be able to get data from localstroage", function() {
    expect(store.readStore("test")).toBe('testdata');
  });
});
