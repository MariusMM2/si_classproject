## Create Gender

`POST /gender`

### Body
- **label** - Label of the gender

### Response
- **Id** 
- **Label**

### Errors
- **400** - One or more query or body attributes are missing or malformed
- **409** - Gender with the same label already exists

### Example Request
`POST /gender`

```javascript
{
    label: "NewGender"
}
```

### Example Response
`201 CREATED`

```javascript
{
    Id: 10,
    Label: "NewGender"
}
```

## Retrieve a Gender

`GET /gender/:id`

### URL Parameters
- **id** - Identifier for the gender

### Response
- **Id** 
- **Label**

### Errors
- **400** - One or more query or body attributes are missing or malformed
- **404** - Gender not found

### Example Request
`GET /gender/10`

### Example Response
`200 OK`

```javascript
{
    Id: 10,
    Label: "NewGender"
}
```

## Retrieve All Genders

`GET /gender`

### Response
- array of genders (see example below)

### Errors
- **404** - No genders found

### Example Request
`GET /gender`

### Example Response
`200 OK`

```javascript
[
    {
        "Id": 1,
        "Label": "male"
    },
    {
        "Id": 2,
        "Label": "female"
    },
    ...
]
```

## Update Gender

`PUT /gender/:id`

### URL Parameters
- **id** - Identifier for the gender

### Body
- **label** - Label of the gender

### Response Status
- **201** - Created new Gender
- **204** - Modified existing Gender

### Response Body
- empty

### Errors
- **400** - One or more query or body attributes are missing or malformed
- **409** - Gender with the same label already exists

### Example Request
`UPDATE /gender/10`

```javascript
{
	label: "NewGender2"
}
```

### Example Response
`204 No Content`

## Delete Gender

`DELETE /gender/:id`

### URL Parameters
- **id** - Identifier for the gender

### Response
- empty

### Errors
- **400** - One or more query or body attributes are missing or malformed
- **404** - Gender not found

### Example Request
`DELETE /gender/10`

### Example Response
`204 No Content`