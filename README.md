# poc-apollo-federation

### Running
Run `npm i && npm run server` and go to http://localhost:4000/graphql. This is the playground for the federated service. 

### Services
There are 3 graphql services, `resource`, `activity`, and `user`.
In the federated playground, click on the Docs or the Schemas tab. Notice that the schemas from all 3 services are stitched together.

Also notice that the type `Activity` has fields that resolve to `Resource` and `Author`, which are types defined in other downstream services.

If you want to access each service individually, you can navigate to  <br />
`resource`: http://localhost:4001/  <br />
`activity`: http://localhost:4002/  <br />
`user`: http://localhost:4003/  <br />
