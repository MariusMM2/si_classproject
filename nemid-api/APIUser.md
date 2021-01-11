## Create User

`POST /user`

### Body
- **nemId**
- **cpr**
- **genderId**
- **email**

### Response
- **Id** 
- **NemId**
- **Cpr**
- **CreatedAt** 
- **ModifiedAt** 
- **GenderId** 
- **Email** 

### Errors
- **409** - User with the same [attributes?] already exists
- **422** - Provided genderId is invalid

### Example Request
`POST /user`

```javascript
{
    nemId: "testNemId",
    cpr: "test1234",
    genderId: 1,
    email: "test@email.com"
}
```

### Example Response
`201 CREATED`

```javascript
{
    "Id": 10,
    "NemId": "testNemId"
    "Cpr": "test1234",
    "CreatedAt": "2000-01-01 00:00:01",
    "ModifiedAt": "2000-01-01 00:00:01",
    "GenderId": 1,
    "Email": "test@email.com",
}
```

## Retrieve a User

`GET /user/:id`

### Parameters
- **id** - Identifier for the user

### Response
- **Id** 
- **NemId**
- **Cpr**
- **CreatedAt** 
- **ModifiedAt** 
- **GenderId** 
- **Email** 

### Errors
- **404** - User not found

### Example Request
`GET /user/10`

### Example Response
`200 OK`

```javascript
{
    "Id": 10,
    "NemId": "testNemId"
    "Cpr": "test1234",
    "CreatedAt": "2000-01-01 00:00:01",
    "ModifiedAt": "2000-01-01 00:00:01",
    "GenderId": 1,
    "Email": "test@email.com",
}
```

## Retrieve All Users

`GET /user`

### Response
- array of users (see example below)

### Errors
- **404** - No users found

### Example Request
`GET /user`

### Example Response
`200 OK`

```javascript
[
    {
        "Id": 10,
        "NemId": "testNemId"
        "Cpr": "test1234",
        "CreatedAt": "2000-01-01 00:00:01",
        "ModifiedAt": "2000-01-01 00:00:01",
        "GenderId": 1,
        "Email": "test@email.com",
    },
    {
        "Id": 11,
        "NemId": "testNemId2"
        "Cpr": "test21234",
        "CreatedAt": "2000-01-01 00:00:01",
        "ModifiedAt": "2000-01-01 00:00:01",
        "GenderId": 1,
        "Email": "test2@email.com",
    },
    ...
]
```

## Update User

`PUT /user/:id`

### Parameters
- **id** - Identifier for the user

### Body
- **nemId**
- **cpr**
- **genderId**
- **email**

### Response Status
- **201** - Created new User
- **204** - Modified existing User

### Response Body
- empty

### Errors
- **409** - User with the same [unique?] attributes already exists
- **422** - Provided genderId is invalid

### Example Request
`UPDATE /user/10`

```javascript
{
    nemId: "testNemId2",
    cpr: "test21234",
    genderId: 2,
    email: "test2@email.com"
}
```

### Example Response
`204 No Content`

## Delete User

`DELETE /user/:id`

### Parameters
- **id** - Identifier for the user

### Response
- empty

### Errors
- **404** - User not found

### Example Request
`DELETE /user/10`

### Example Response
`204 No Content`