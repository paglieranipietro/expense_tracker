/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2952775004")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number1674887086",
    "max": null,
    "min": null,
    "name": "importo",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2952775004")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number1674887086",
    "max": null,
    "min": null,
    "name": "spesa",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
