/*jshint eqeqeq:false */

(function (window) {
  'use strict';

  /**
   * Creates a new client side storage object and will create an empty
   * collection if no collection already exists.
   *
   * @param {string} name The name of our DB we want to use
   * @param {function} callback Our fake DB uses callbacks because in
   * real life you probably would be making AJAX calls
   */
  function Store(name, callback) {
    callback = callback || function () {};

    this._dbName = name;

    if (!localStorage[name]) {
      var data = {
        todos: [],
      };

      localStorage[name] = JSON.stringify(data);
    }
    //START EDIT
    // Using cache property for faster memory accessing
    // callback.call(this, JSON.parse(localStorage[name]));

    this._cacheMem = JSON.parse(localStorage[name]);
    callback.call(this, this._cacheMem);
    // END EDIT
  }

  /**
   * Finds items based on a query given as a JS object
   *
   * @param {object} query The query to match against (i.e. {foo: 'bar'})
   * @param {function} callback	 The callback to fire when the query has
   * completed running
   *
   * @example
   * db.find({foo: 'bar', hello: 'world'}, function (data) {
   *	 // data will return any items that have foo: bar and
   *	 // hello: world in their properties
   * });
   */
  Store.prototype.find = function (query, callback) {
    if (!callback) {
      return;
    }

    // START EDIT
    // EDIT: Fetch todos from cache memory(_cacheMem)
    // var todos = JSON.parse(localStorage[this._dbName]).todos;

    var todos = this._cacheMem.todos;

    // END EDIT

    callback.call(
      this,
      todos.filter(function (todo) {
        for (var q in query) {
          if (query[q] !== todo[q]) {
            return false;
          }
        }
        return true;
      })
    );
  };

  /**
   * Will retrieve all data from the collection
   *
   * @param {function} callback The callback to fire upon retrieving data
   */
  Store.prototype.findAll = function (callback) {
    callback = callback || function () {};

    // START EDIT
    // EDIT: Retrieve todos from cache memory instead of localstorage
    // callback.call(this, JSON.parse(localStorage[this._dbName]).todos);

    callback.call(this, this._cacheMem.todos);

    // END EDIT
  };

  /**
   * Will save the given data to the DB. If no item exists it will create a new
   * item, otherwise it'll simply update an existing item's properties
   *
   * @param {object} updateData The data to save back into the DB
   * @param {function} callback The callback to fire after saving
   * @param {number} id An optional param to enter an ID of an item to update
   */
  Store.prototype.save = function (updateData, callback, id) {
    // START EDIT
    // EDIT: Retrieve todos from cache memory instead of localstorage
    // var data = JSON.parse(localStorage[this._dbName]);

    var data = this._cacheMem;

    // END EDIT
    var todos = data.todos;

    callback = callback || function () {};

    // START EDIT
    // EDIT: Avoid generating unnecessary IDs by moving
    // by moving this code to an else block

    // Generate an ID
    // var newId = '';
    // var charset = '0123456789';

    // for (var i = 0; i < 1; i++) {
    //   newId += charset.charAt(Math.floor(Math.random() * charset.length));
    // }

    // If an ID was actually given, find the item and update each property
    if (id) {
      for (var i = 0; i < todos.length; i++) {
        if (todos[i].id === id) {
          for (var key in updateData) {
            todos[i][key] = updateData[key];
          }
          break;
        }
      }

      // START EDIT
      // EDIT: This code will run in duplicates
      // since it runs in both situtions.
      // Move to to after the if/else block
      // localStorage[this._dbName] = JSON.stringify(data);
      // END EDIT
      callback.call(this, todos);
    } else {
      // START EDIT
      // Assign an ID
      // Generate an ID
      var newId = '';
      var charset = '0123456789';

      // for (var i = 0; i < 6; i++) {
      //   newId += charset.charAt(Math.floor(Math.random() * charset.length));
      // }

      var isUniqueId = true;

      while (isUniqueId) {
        for (var i = 0; i < 6; i++) {
          newId += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        isUniqueId = false;
        for (var i = 0; i < todos.length; i++) {
          if (todos[i].id == newId) {
            isUniqueId = true;
          }
        }
      }

      // END EDIT

      updateData.id = parseInt(newId);

      todos.push(updateData);

      // START EDIT
      // EDIT: This code will run in duplicates
      // move to after if/else block
      // localStorage[this._dbName] = JSON.stringify(data);

      // END EDIT
      callback.call(this, [updateData]);
    }
    localStorage[this._dbName] = JSON.stringify(data);
  };

  /**
   * Will remove an item from the Store based on its ID
   *
   * @param {number} id The ID of the item you want to remove
   * @param {function} callback The callback to fire after saving
   */
  Store.prototype.remove = function (id, callback) {
    // START EDIT
    // EDIT: Fetch from cache memory instead of localstorage
    // var data = JSON.parse(localStorage[this._dbName]);

    var data = this._cacheMem;
    // END EDIT

    var todos = data.todos;

    // START EDIT
    // EDIT: Eliminate unnecessary varible
    // var todoId;

    // END EDIT

    for (var i = 0; i < todos.length; i++) {
      if (todos[i].id == id) {
        // START EDIT
        // EDIT: Eliminate unnecessary varible
        // todoId = todos[i].id;

        // END EDIT

        todos.splice(i, 1);
      }
    }

    // START EDIT
    // EDIT: This code block is unnecessary since
    // the splice is in the above for loop
    // for (var i = 0; i < todos.length; i++) {
    //   if (todos[i].id == todoId) {
    //     todos.splice(i, 1);
    //   }
    // }

    // END EDIT

    localStorage[this._dbName] = JSON.stringify(data);
    callback.call(this, todos);
  };

  /**
   * Will drop all storage and start fresh
   *
   * @param {function} callback The callback to fire after dropping the data
   */
  Store.prototype.drop = function (callback) {
    // START EDIT
    // EDIT: Use cache object instead
    // var data = { todos: [] };
    // localStorage[this._dbName] = JSON.stringify(data);

    this._cacheMem = { todo: [] };
    localStorage[this._dbName] = JSON.stringify(this._cacheMem);

    callback.call(this, data.todos);
    // END EDIT
  };

  // Export to window
  window.app = window.app || {};
  window.app.Store = Store;
})(window);
