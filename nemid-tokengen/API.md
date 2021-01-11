## Generate Token
Generate an authentication token if the provided
credentials are valid.

`POST /generate-token`

### Body
- **nemId**
- **generatedCode**

### Response Status
- 200 - OK

### Response Body
- empty

### Errors
- **403** - Invalid NemID or Generated Code, or the attempt is older than 5 minutes

### Example Request
`POST /generate-token`

```javascript
{
    nemId: "testNemId",
    generatedCode: "123456",
}
```

### Example Response
`200 OK`

## Update States
GET request that will update all the
AuthLog entries that do not have a token record
associated with it and were generated more than 5
minutes ago to Failed

`GET /update-states`

### Response Status
- 204 - No Content

### Response Body
- empty

### Errors
- none

### Example Request
`GET /update-states`

### Example Response
`200 No Content`
