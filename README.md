# Boltwise Takehome

Candidate: Jeff Roach

This code implements a service that supports an API for managing product inventory and orders.  

## How to run: 

(With Docker installed)
> npm run compose

Browse to http://localhost:3131/docs to use swagger UI for interacting with API


## src/routes
This folder contains the /products and /orders endpoints 

I left out adding new products (POST /products) assuming all products will source from the CSVs. 

There are some notes in a different section below on how these endpoints handle concurrent inventory updates (orders and direct inventory updates).

## src/db/connectors
This folder contains the SQL queries for the product and orders tables

## src/controllers
This folder contains the logic supporting the API.

For products this pretty basic, for orders its more complicated because 

## src/sellers
This folder contains the seller csvs and the parsers that we need to create for each new seller to map product attributes to the standard set.  

Only "new" seller CSVs will be processed (when the server starts).  If you restart the sever 

## notes on concurrency 
When using POST /order to place an order or POST product/:id/inventory to update product inventory these opperations are queued for processing one at a time.  Inventory updates are prioritized.  

POST /order will return an order back to the client with 'pending' status.  For now you'll have to GET /order/:id to check on the status of the order but in a real system we may want the client and server to communicate via web socket.  