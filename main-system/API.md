## Authenticate
Authenticates a user using a combination of
NemID and password credentials.

`POST /authenticate`

### Body
- **nemId**
- **password**

### Response Status
- 204 - No Content

### Response Body
- empty

### Errors
- **400** - One or more query or body attributes are missing or malformed
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
`204 No Content`
