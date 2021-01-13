## Create User

`POST /user`

### Body
- **firstName**
- **lastName**
- **dateOfBirth**
- **email**

### Response
- **Id** 
- **FirstName**
- **LastName**
- **DateOfBirth**
- **Cpr**
- **Email** 
- **NemId** 
- **CreatedAt** 
- **ModifiedAt** 

### Errors
- **400** - One or more query or body attributes are missing or malformed
- **401** - Authentication credentials not provided
- **403** - Authentication credentials invalid
- **409** - User with the same email already exists
- **422** - Provided genderId is invalid

### Example Request
`POST /user`

```javascript
{
    firstName: "firstName",
    lastName: "lastName",
    dateOfBirth: "2002-01-10",
    email: "name@email.com"
}
```

### Example Response
`201 CREATED`

```javascript
{
    "Id": 4,
    "FirstName": "firstName",
    "LastName": "lastName",
    "DateOfBirth": "2002-01-10",
    "Cpr": "1001024661",
    "Email": "name@email.com",
    "NemId": "731661913",
    "CreatedAt": "2021-01-13 21:47:21",
    "ModifiedAt": "2021-01-13 21:47:21"
}
```

## Retrieve a User

`GET /user/:id`

### URL Parameters
- **id** - Identifier for the user

### Response
- **Id** 
- **FirstName**
- **LastName**
- **DateOfBirth**
- **Cpr**
- **Email** 
- **NemId** 
- **CreatedAt** 
- **ModifiedAt** 

### Errors
- **400** - One or more query or body attributes are missing or malformed
- **401** - Authentication credentials not provided
- **403** - Authentication credentials invalid
- **404** - User not found

### Example Request
`GET /user/4`

### Example Response
`200 OK`

```javascript
{
    "Id": 4,
    "FirstName": "firstName",
    "LastName": "lastName",
    "DateOfBirth": "2002-01-10",
    "Cpr": "1001024661",
    "Email": "name@email.com",
    "NemId": "731661913",
    "CreatedAt": "2021-01-13 21:47:21",
    "ModifiedAt": "2021-01-13 21:47:21"
}
```

## Delete User

`DELETE /user/:id`

### URL Parameters
- **id** - Identifier for the user

### Response
- empty

### Errors
- **400** - One or more query or body attributes are missing or malformed
- **401** - Authentication credentials not provided
- **403** - Authentication credentials invalid
- **404** - User not found

### Example Request
`DELETE /user/4`

### Example Response
`204 No Content`