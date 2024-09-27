# Stockly

#### Video Demo: [https://youtu.be/yPRaan05zEI?si=r2brX1cvdt3wm6A5]

## Description

This is Stockly, developed for CS50's Introduction to Computer Science Final Project. Stockly is an inventory and order management application created to help small businesses manage their products, orders, and clients more efficiently and practically. This app streamlines the management of products, clients, and orders, allowing users to easily track their business operations.

## Features

Stockly includes the following key features:

### Main Screens

1. **Dashboard**:

   - View an overview of your business metrics, including:
     - Total products registered
     - Total stock available
     - Number of pending orders
     - Total registered clients
   - Interactive chart displaying revenue from each month of the year, with detailed total revenue data for completed orders.

2. **Products**:

   - Manage your product inventory:
     - Add new products
     - Edit existing product details
     - Delete products from the inventory

3. **Clients**:

   - Maintain client information:
     - Add new clients
     - Edit client details
     - Delete client records

4. **Orders**:
   - Track and manage orders efficiently:
     - Change order status
     - Add new orders
     - Edit order details
     - Delete orders
     - Print specific order data or save it to a PDF file

### Profile Management

- Manage your account settings:
  - Edit your profile information
  - Logout of the application
  - Delete your account if needed

## Technologies Used

- **Frontend**: React Native
- **Backend**: Flask
- **Database**: SQLite
- **ORM**: Flask-SQLAlchemy

## Installation

To set up Stockly on your local machine, follow these steps:

1. **Clone the repository:**

```
git clone https://github.com/sophialaurans/stockly-cs50-final-project
```

2. **Install dependencies:**

### For the backend:

cd backend

```
# Activate the virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### For the frontend:

```
cd frontend
npm install
```

3. **Run the application:**

### Start the backend server:

```
cd backend
flask run
```

### Start the frontend application:

```
cd frontend/Stockly
npm start
```

## Usage

Once the application is running, you can navigate through the different screens using the app interface. Create and manage your inventory, track clients and orders, and view insights on your dashboard.

## Acknowledgments

App Icon: The app icon used in Stockly was adapted from an original design by Freepik. Colors were modified to better fit the theme of the application.
