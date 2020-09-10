# poc-apollo-federation
run `npm run server` and go to localhost:4000/graphql

In playground, in HTTP HEADERS, 
paste 
```
{
 "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRW1pbHkgWW9vbiIsInVzZXJJZCI6IjEiLCJpYXQiOjE1ODY5MDAyNTEsImV4cCI6MTY4Njk4NjY1MSwic3ViIjoiMTIzNDUifQ.6gdLi8bFE8wB5DtkoLvBLYPDVZBZVmmpQx0ibt4ER4Q"
}
```

This authorizes you to userId 1.
