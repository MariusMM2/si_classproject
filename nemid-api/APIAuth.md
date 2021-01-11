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