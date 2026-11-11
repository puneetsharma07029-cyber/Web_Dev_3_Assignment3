# Inventory and Data Management System

Beginner-friendly REST API using Node.js, Express, MongoDB, Mongoose and dotenv.

## Run the project
1. Install Node.js and start MongoDB.
2. Open terminal inside this project folder.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:5000`.

MongoDB URL and PORT are stored in `.env`.

## API endpoints
Base URL: `http://localhost:5000/api/products`

| Method | URL | Work |
|---|---|---|
| POST | `/` | Create product |
| GET | `/` | Get products |
| GET | `/:id` | Get one product |
| PUT | `/:id` | Update product details |
| DELETE | `/:id` | Delete product |
| PATCH | `/:id/restock` | Add stock |
| PATCH | `/:id/sale` | Sell stock |
| GET | `/reports/low-stock` | Low-stock report |
| GET | `/reports/category-summary` | Category summary |

## Create product example
POST `/api/products`

JSON body:
```json
{
  "name": "Keyboard",
  "sku": "KEY-101",
  "category": "Electronics",
  "price": 750,
  "quantity": 10,
  "supplier": "ABC Suppliers",
  "lowStockThreshold": 5
}
```

## Filtering, sorting and pagination
`GET /api/products?category=Electronics&sortBy=price&order=asc&page=1&limit=5`

Search product name:
`GET /api/products?name=key`

Allowed sortBy fields: name, price, quantity, createdAt.
order can be asc or desc.

## Update product details
PUT `/api/products/PRODUCT_ID`

```json
{
  "price": 800,
  "supplier": "New Supplier"
}
```

Change quantity through restock or sale endpoints.

## Restock
PATCH `/api/products/PRODUCT_ID/restock`

```json
{"quantity": 5}
```

## Sale
PATCH `/api/products/PRODUCT_ID/sale`

```json
{"quantity": 2}
```

Replace PRODUCT_ID with the actual MongoDB product ID.
Do not share your .env file publicly. `node_modules` is created by npm install.
