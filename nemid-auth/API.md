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

