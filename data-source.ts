import { DataSource } from "typeorm";
import { config } from 'dotenv';
import { User } from "./src/users/entities/user.entity";
import { Profile } from "./src/users/entities/profile.entity";
import { Product } from "./src/products/entities/product.entity";
import { Category } from "./src/categories/entities/category.entity";
import { Order } from "./src/orders/entities/order.entity";
import { OrderItem } from "./src/orders/entities/order-item.entity";
import { Cart } from "./src/carts/entities/cart.entity";
import { CartItem } from "./src/carts/entities/cart-item.entity";

config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User, Profile, Product, Category, Order, OrderItem, Cart, CartItem], // todas las entidades
    //   migrations: ['src/migrations/*.ts'],
    migrations: ['src/migrations/*.ts', 'dist/migrations/*.js'],
    ssl: { rejectUnauthorized: false }, // necesario para Render
});