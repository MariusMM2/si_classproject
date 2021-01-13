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

## Change Password
Adds a new password for a given NemId and disables the 
old one (which is also provided).

`PUT /change-nem-id-password`

### Body
- **nemId**
- **oldPassword**
- **newPassword**

### Response Status
- 200 - OK

### Response Body
- empty

### Errors
- **400** - One or more query or body attributes are missing or malformed
- **401** - Authentication credentials not provided
- **403**   
    - Authentication credentials invalid OR
    - Invalid NemID or Old Password

### Example Request
`PUT /change-nem-id-password`

```javascript
{
    nemId: "testNemId",
    oldPassword: "password",
    newPassword: "password2",
}
```

### Example Response
`200 OK`

## Reset Password
Disables all passwords for a user and
creates a new one.

`PUT /reset-nem-id-password`

### Body
- **cpr**
- **password**

### Response Status
- 200 - OK

### Response Body
- empty

### Errors
- **400** - One or more query or body attributes are missing or malformed
- **404** - Invalid CPR number

### Example Request
`PUT /reset-nem-id-password`

```javascript
{
    cpr: "test1234",
    password: "password3",
}
```

### Example Response
`200 OK`
