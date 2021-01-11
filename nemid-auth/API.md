## Login
Authenticates a user using a combination of
NemID and password credentials.

`POST /login`

### Body
- **nemId**
- **password**

### Response Status
- 201 - Created

### Response Body
- empty

### Errors
- **403** - Invalid NemID or Password

### Example Request
`POST /login`

```javascript
{
    nemId: "testNemId",
    password: "password",
}
```

### Example Response
`201 Created`

