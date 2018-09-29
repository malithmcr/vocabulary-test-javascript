class Store {
  constructor() { 
    this.Store = window.localStorage;
  }
  
    /*
  * Create LocalStorage if browser supported
  * @param name | string ie: (vocabulary-list)
  * @param data | obj
  */
  createStore(name, data) {
    this.Store.setItem(name, data);
  }
  
  /*
  * Read  LocalStorage
  * @param name | string | Store name
  */
  readStore(name) {
   return JSON.parse(this.Store.getItem(name));
  }
  
  /*
  * Update  LocalStorage
  * @param storage | string | Store name
  * @param list | Array | array inside storage Obj
  * @param data | Obj | Obj that push into list
  */
  updateStore(storage, list, data) {
    //Get Storage and then push the current data
    let activeStorage = this.readStore(storage);
        activeStorage.list.push(data);
  }
  
  /*
   * Remove Item
   * @param name | string
  */
  removeStore(name) {
    return this.Store.removeItem(name);
  }
  
}

export default Store;