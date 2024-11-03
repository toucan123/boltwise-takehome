# Boltwise Takehome

Candidate: Jeff Roach

This code implements a service that supports an API for managing product inventory and orders.  

## src/routes
This folder contains the /products and /orders routes 

There are endpoints for searching and updating product inventory but I left out adding new products (POST /products) assuming all products will source from the CSVs. 
There are endpoints for creating orders and fetching the order status.  

## src/db/connectors
This folder contains the SQL queries for the product and orders tables

## src/controllers
This folder contains the logic supporting the API.

For products this pretty basic, for orders its more complicated because 

## src/sellers
This folder contains the seller csvs and the parsers that we need to create for each new seller to map product attributes to the standard set.  


