## Authenticate

`POST /authenticate`

### Body
- **nemId**
- **password**

### Response
- **Id** 
- **NemId**
- **Cpr**
- **CreatedAt** 
- **ModifiedAt** 
- **GenderId** 
- **Email** 

### Errors
- **403** - Invalid NemID or Password

### Example Request
`POST /authenticate`

```javascript
{
    nemId: "testNemId",
    password: "password",
}
```

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

## Change Password

`POST /change-password`

### Body
- **nemId**
- **oldPassword**
- **newPassword**

### Response Status
- 201 - Created

### Response Body
- empty

### Errors
- **403** - Invalid NemID or Old Password

### Example Request
`POST /change-password`

```javascript
{
    nemId: "testNemId",
    oldPassword: "password",
    newPassword: "password2",
}
```

### Example Response
`201 Created`