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
