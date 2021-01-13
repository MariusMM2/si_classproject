## Login
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

`POST /change-password`

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
`200 OK`

## Reset Password
Disables all passwords for a user and
creates a new one.

`POST /reset-password`

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
`POST /reset-password`

```javascript
{
    cpr: "test1234",
    password: "password3",
}
```

### Example Response
`200 OK`

