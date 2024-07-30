# Get Autobiz-Trade user info

`[GET] <AT_API>/carcheckImport/groupUserByAutobizId/<carcheckUserId>`

- renvoie l'id user autobiztrade _id_
- les groupes dont le user est membre _inGroups_
- les groupes dont le user est propriétaire _hasGroups_

Exemple :

`[GET] <AT_API>/carcheckImport/groupUserByAutobizId/FR1630593`

````{
    "id": 8,
    "autobizUserId": "FR_1630593",
    "notificationDaily": false,
    "notificationNewPush": false,
    "notificationAuction": false,
    "inGroups": [
        {
            "id": 1,
            "name": "Easy Reprise"
        },
        {
            "id": 4,
            "name": "Pautric"
        }
    ],
    "hasGroups": [
        {
            "id": 11,
            "name": "testProduit"
        }
    ]
}
```

# Push vehicle

`[POST] <AT_API>/carcheckImport/{$carcheckRecordId}`

- créé le vehicle
- associe le point de vente si existant dans la base carcheck sinon importe

retourne 200

````

{id: <vehicleId>}

```

# Push sale

`[POST] <AT_API>/admin/sale/`

- créé le une vente pour un véhicle

parameters :

| field                   | required | type    | note                                                                                             |
| :---------------------- | :------- | :------ | :----------------------------------------------------------------------------------------------- |
| vehicleId               | true     | integer |                                                                                                  |
| validationStatus        | true     | string  | "DRAFT" ou "VALIDATED" ou "CANCELED", on ne peut pas avoir plusieurs annonces VALIDATED en vente |
| supplyType              | true     | string  | "OFFER_TO_PRIVATE" ou "STOCK"                                                                    |
| acceptSubmission        | true     | boolean |                                                                                                  |
| acceptAuction           | true     | boolean |                                                                                                  |
| acceptImmediatePurchase | true     | boolean |                                                                                                  |
| startDateTime           | true     | date    |                                                                                                  |
| endDateTime             | true     | date    |                                                                                                  |
| auctionStartPrice       | false    | integer | required si acceptAuction = true                                                                 |
| auctionStepPrice        | false    | integer | required si acceptAuction = true                                                                 |
| auctionReservePrice     | false    | integer |                                                                                                  |
| immediatePurchasePrice  | false    | integer | required si acceptImmediatePurchase = true                                                       |
| ownerId                 | false    | integer |                                                                                                  |
| groupId                 | false    | integer |                                                                                                  |
| listId                  | false    | integer |                                                                                                  |
| comment                 | false    | string  |                                                                                                  |
| expressSale             | false    | boolean |                                                                                                  |

retourne 200

```

{id: <saleId>}

```

Exemple

Body :{
"vehicleId": 4092,
"validationStatus": "DRAFT",
"supplyType": "STOCK",
"acceptSubmission": true,
"acceptAuction": true,
"acceptImmediatePurchase": true,
"auctionStartPrice": 1000,
"auctionStepPrice": 200,
"auctionReservePrice": 4000,
"immediatePurchasePrice": 5000,
"startDateTime": "2021-01-11T13:15:38Z",
"endDateTime": "2021-01-12T13:15:38Z",
"ownerId": 514,
"groupId": 9,
"listId": 1,
"comment": "achetez-moi",
"expressSale": true
}

```

# Get Vehicles by fileNumber

`[GET] <AT_API>/admin/vehicle?filter={"fileNumber":"refHexaId"}`

Pas de changement

# Get offers from sale or vehicle

`[GET] <AT_API>/admin/offer?filter={"saleId":"tradeSaleId"}`
liste toutes les offre liées à une vente

`[GET] <AT_API>/admin/offer?filter={"vehicleId":"tradeVehicleId"}`
liste toutes les offre liées à une vehicule

```

```
