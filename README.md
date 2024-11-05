# Boltwise Takehome

Candidate: Jeff Roach

This repo implements a service that supports an API for managing product inventory and orders.

Prompt: https://you.ashbyhq.com/boltwise/assignment/2bedc393-596b-4262-8dcf-35c2205b0ad1

## How to run: 

(With Docker installed)
> npm run compose

Browse to http://localhost:3131/docs to use the Swagger UI for interacting with API


## src/routes
This folder contains the /products and /orders routes which you can see documented in the Swagger UI.

Adding new products (POST /products) was left out assuming all new products will source from the CSVs. 

Products can be searched by their properties or you can add remove inventory (quantity) from products. 

Here's an example post body for a product search:

```
{
  "categories": [
    "Hex Cap Screw"
  ],
  "finishes": [
    "Zinc"
  ],
  "priceHigh": 1.50
}
```

Order can be created or looked up by id.

Here's an example post body for an order:

```
{
  "productQuantities": {
    "7d9004b6edd537755ec217f1325ab307": 20,
    "03d4a0effe1e844f5cebf2e4e8014961": 40
  }
}
```

Notes on how concurrent inventory updates and orders are processed can be found in a different section.  

## src/db/connectors
This folder contains code for building SQL queries to run on the product and orders tables.

## src/controllers
This folder contains the logic supporting the API.

## src/sellers
This folder contains the seller CSVs and the parsers that we need to create for each new seller to map product attributes to the standard set.  

Only "new" seller CSVs will be processed (when the server starts).  This is controlled by the seller_batch table that ensures we're not re-running an old file.

## notes on concurrency 
When using POST /orders to place an order or POST products/:id/inventory to update product inventory these operations are queued for processing one at a time (but direct inventory updates are prioritized).

POST /orders will return an order back to the client with a 'pending' status. After it is processed it will have an 'initiated' status if successful or a 'failure' status if it failed for a reason like requesting a quantity greater than what is available.

For now you'll have to make a subsequent GET /order/:id request to check on the changed status of the order but in a real system this may be web socket communication between server and client. 

In a real system there would likely be other stages of processing the order like adding payment and shipping details, commiting/completing the transaction or expiring it (returning the inventory back to the products).  There may come a need to create a different data model for carts vs orders.  

# notes on a recommender
I didn't build a recommender for inventory but one way to achieve that would be to implement a RAG system by adding the Vector extension to postgres (pgvector) and add a Vector column to the products table that could store an embedding vector generated from the product attributes we care about.  We could then leverage an LLM to help us generate some product attributes, generate embeddings for those and the natural language search query and find the most similar products from the db.  The LLM would also benefit from having the context of existing product finishes and categories (maybe then being able to suggest finish:Zinc for "best outdoor use").  If there are a lot of these though that could lead to performance and quality problems.