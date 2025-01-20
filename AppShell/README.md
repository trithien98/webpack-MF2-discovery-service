# T-Shirt Store Micro Frontend Application

This project demonstrates a Micro Frontend architecture using Module Federation. The application is split into multiple independent frontend applications that work together to create a cohesive T-shirt shopping experience.

## Architecture

The application consists of three main parts:

1. **AppShell**: The container application that:
   - Handles the main routing
   - Loads and orchestrates the micro frontends
   - Provides the main navigation structure

2. **HomeMFE**: The home page micro frontend that:
   - Displays featured products
   - Shows promotional content
   - Provides navigation to the catalogue

3. **CatalogueMFE**: The product catalogue micro frontend that:
   - Lists all available t-shirts
   - Provides product details views
   - Handles its own internal routing

## Technical Stack

- React
- Module Federation
- React Router DOM (v6.21.3)
- Webpack

## Known Issues

### React Router DOM Version 7

Currently, there's a known compatibility issue between Module Federation and React Router DOM v7. The issue manifests as a runtime error: