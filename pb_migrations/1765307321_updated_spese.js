/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2952775004")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date1149184851",
    "max": "",
    "min": "",
    "name": "data",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2952775004")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date1149184851",
    "max": "",
    "min": "",
    "name": "dataSpesa",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
})
