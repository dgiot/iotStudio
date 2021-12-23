let Salt = {
  name: 'shuwaDB',
  version: 1,
  db: null,
  table: 'shuwaDBTable',
}
/**
 * 增加或更新shuwaDb字段的值
 * @param {*} key 传递过来的键（在存储的时候）
 * @param {*} val 传递过来的值（在存储的时候）
 * @param {*} back 回调函数
 * @param {*} value 整个数据，需要更新的，是更新的值
 */

let shuwaDb = {
  openDB(name, version, table, callback) {
    var request = window.indexedDB.open(name, version)
    request.onerror = function (e) {
      dgiotlog.log(e.currentTarget.error.message)
    }
    request.onsuccess = function (e) {
      Salt.db = e.target.result
      if (callback && typeof callback === 'function') {
        callback(Salt.db)
      }
    }
    request.onupgradeneeded = function (e) {
      var db = e.target.result
      if (!db.objectStoreNames.contains(table)) {
        db.createObjectStore(table, {
          keyPath: 'id',
        })
      }
    }
  },
  setItem(key, val) {
    shuwaDb.openDB(Salt.name, Salt.version, Salt.table, function () {
      try {
        var addData = [
          {
            id: key,
            value: val,
          },
        ]
        var transaction = Salt.db.transaction(Salt.table, 'readwrite')
        var store = transaction.objectStore(Salt.table)
        for (var i = 0; i < addData.length; i++) {
          store.add(addData[i])
        }
        shuwaDb.closeDB()
      } catch (error) {
        dgiotlog.log(error)
      }
    })
  },
  getItem: function (val, back) {
    shuwaDb.openDB(Salt.name, Salt.version, Salt.table, function () {
      var transaction = Salt.db.transaction(Salt.table, 'readwrite')
      var store = transaction.objectStore(Salt.table)
      var request = store.get(val)
      request.onsuccess = function (e) {
        if (back && typeof back === 'function') {
          if (e.target.result) {
            back(e.target.result.value)
          } else {
            back('')
          }
          shuwaDb.closeDB()
        }
      }
    })
  },
  putItem(key, value) {
    shuwaDb.openDB(Salt.name, Salt.version, Salt.table, function () {
      var transaction = Salt.db.transaction(Salt.table, 'readwrite')
      var store = transaction.objectStore(Salt.table)
      var request = store.get(key)
      request.onsuccess = function (e) {
        try {
          var resultData = e.target.result
          resultData.value = value
          var resultInfo = store.put(resultData)
          resultInfo.onsuccess = function (e) {
            if (e.type == 'success') {
              shuwaDb.closeDB()
            }
          }
        } catch (error) {
          shuwaDb.setItem(key, value)
        }
      }
    })
  },
  deleteItem(key) {
    shuwaDb.openDB(Salt.name, Salt.version, Salt.table, function () {
      var transaction = Salt.db.transaction(Salt.table, 'readwrite')
      var store = transaction.objectStore(Salt.table)
      var result = store.delete(key)
      result.onsuccess = function (e) {
        if (e.type == 'success') {
          shuwaDb.closeDB()
        }
      }
    })
  },
  clearTable() {
    shuwaDb.openDB(Salt.name, Salt.version, Salt.table, function () {
      var transaction = Salt.db.transaction(Salt.table, 'readwrite')
      var store = transaction.objectStore(Salt.table)
      var result = store.clear()
      result.onsuccess = function (e) {
        if (e.type == 'success') {
          shuwaDb.closeDB()
        }
      }
    })
  },
  closeDB() {
    dgiotlog.log(Salt)
    Salt.db.close()
  },
}
//初始化数据库
shuwaDb.openDB(Salt.name, Salt.version, Salt.table)

export default shuwaDb
