// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../app.module';
// import { CategoriesService } from '../categories/categories.service';
// import { ProductsService } from '../products/products.service';
// import { UsersService } from '../users/users.service';
// import * as bcrypt from 'bcrypt';

// async function bootstrap() {
//   const app = await NestFactory.createApplicationContext(AppModule);
//   const categoriesService = app.get(CategoriesService);
//   const productsService = app.get(ProductsService);

//   const usersService = app.get(UsersService);

//   console.log('🌱 Iniciando seed de base de datos...');

//   // ====== Crear Usuarios ======
//   const users = [
//     { name: 'Admin Principal', email: 'admin@ecommerce.com', password: 'admin123', role: 'admin' },
//     { name: 'Usuario Alumno 1', email: 'alumno1@ecommerce.com', password: 'alumno123', role: 'customer' },
//     { name: 'Usuario Alumno 2', email: 'alumno2@ecommerce.com', password: 'alumno123', role: 'customer' },
//   ];

//   for (const u of users) {
//     const exists = await usersService.findByEmail(u.email);
//     if (!exists) {
//       const hashedPassword = await bcrypt.hash(u.password, 10);
//       const user = await usersService.create({ email: u.email, password: hashedPassword, name: u.name });
//       user.role = u.role as 'admin' | 'customer';
//       await (usersService as any).usersRepo.save(user); // guardado final
//       console.log(`Usuario creado: ${u.email} (${u.role})`);
//     }
//   }

//   // ====== Crear Categorías ======
//   const electronics = await categoriesService.create({
//     name: 'Electrónica',
//     description: 'Dispositivos, gadgets y accesorios tecnológicos',
//   });

//   const fashion = await categoriesService.create({
//     name: 'Moda',
//     description: 'Ropa, calzado y accesorios',
//   });

//   const home = await categoriesService.create({
//     name: 'Hogar',
//     description: 'Artículos para el hogar y la cocina',
//   });

//   const sports = await categoriesService.create({
//     name: 'Deportes',
//     description: 'Equipamiento y accesorios deportivos',
//   });

//   const books = await categoriesService.create({
//     name: 'Libros',
//     description: 'Libros de distintos géneros y autores',
//   });

//   // ====== Crear Productos ======
//   const products = [
//     // Electrónica
//     { name: 'Laptop HP Pavilion 15"', description: 'Laptop con Intel i5, 8GB RAM, 512GB SSD', price: 850.00, stock: 10, categoryId: electronics.id },
//     { name: 'Smartphone Samsung Galaxy S23', description: 'Pantalla AMOLED, 128GB almacenamiento', price: 999.99, stock: 15, categoryId: electronics.id },
//     { name: 'Auriculares Sony WH-1000XM5', description: 'Auriculares inalámbricos con cancelación de ruido', price: 320.00, stock: 20, categoryId: electronics.id },
//     { name: 'Mouse Logitech MX Master 3', description: 'Mouse inalámbrico ergonómico', price: 95.00, stock: 30, categoryId: electronics.id },

//     // Moda
//     { name: 'Zapatillas Nike Air Max 2024', description: 'Calzado deportivo edición limitada', price: 120.00, stock: 25, categoryId: fashion.id },
//     { name: 'Camisa Formal Slim Fit', description: 'Camisa blanca de algodón 100%', price: 45.00, stock: 40, categoryId: fashion.id },
//     { name: 'Chaqueta de cuero', description: 'Chaqueta negra estilo clásico', price: 180.00, stock: 12, categoryId: fashion.id },

//     // Hogar
//     { name: 'Cafetera Nespresso', description: 'Cafetera automática con cápsulas incluidas', price: 150.00, stock: 18, categoryId: home.id },
//     { name: 'Juego de ollas Tramontina', description: 'Set de 5 piezas de acero inoxidable', price: 200.00, stock: 10, categoryId: home.id },
//     { name: 'Aspiradora Dyson V11', description: 'Aspiradora inalámbrica con alta potencia', price: 499.00, stock: 8, categoryId: home.id },

//     // Deportes
//     { name: 'Balón de Fútbol Adidas', description: 'Balón oficial tamaño 5', price: 35.00, stock: 50, categoryId: sports.id },
//     { name: 'Bicicleta de Montaña Trek', description: 'Bicicleta profesional con 24 cambios', price: 780.00, stock: 5, categoryId: sports.id },
//     { name: 'Guantes de Box Everlast', description: 'Guantes profesionales de cuero', price: 70.00, stock: 20, categoryId: sports.id },

//     // Libros
//     { name: 'Cien Años de Soledad', description: 'Gabriel García Márquez - Realismo mágico', price: 25.00, stock: 35, categoryId: books.id },
//     { name: 'El Señor de los Anillos', description: 'J.R.R. Tolkien - Fantasía épica', price: 40.00, stock: 15, categoryId: books.id },
//     { name: 'Clean Code', description: 'Robert C. Martin - Buenas prácticas de programación', price: 50.00, stock: 10, categoryId: books.id },
//   ];

//   for (const product of products) {
//     await productsService.create(product);
//   }

//   console.log('✅ Seed insertado con éxito');
//   await app.close();
// }

// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CategoriesService } from '../categories/categories.service';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const categoriesService = app.get(CategoriesService);
  const productsService = app.get(ProductsService);
  const usersService = app.get(UsersService);

  console.log('🌱 Iniciando seed de base de datos...');

  // ====== Helpers ======
  // async function findOrCreateUser(data: { name: string; email: string; password: string; role: 'admin' | 'customer' }) {
  //   let user = await usersService.findByEmail(data.email);
  //   if (!user) {
  //     const hashedPassword = await bcrypt.hash(data.password, 10);
  //     user = await usersService.create({ email: data.email, password: hashedPassword, name: data.name });
  //     user.role = data.role;
  //     await (usersService as any).usersRepo.save(user); // si tu servicio expone el repo
  //     console.log(`Usuario creado: ${data.email} (${data.role})`);
  //   }
  //   return user;
  // }
  async function findOrCreateUser(data: { name: string; email: string; password: string; role: 'admin' | 'customer' }) {
    let user = await usersService.findByEmail(data.email);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    if (!user) {
      user = await usersService.create({ email: data.email, password: hashedPassword, name: data.name });
      user.role = data.role;
      await (usersService as any).usersRepo.save(user);
      console.log(`Usuario creado: ${data.email}`);
    } else {
      user.name = data.name;
      user.password = hashedPassword;
      user.role = data.role;
      await (usersService as any).usersRepo.save(user);
      console.log(`Usuario actualizado: ${data.email}`);
    }
    return user;
  }


  async function findOrCreateCategory(data: { name: string; description: string }) {
    const existing = await categoriesService.findByName(data.name);
    if (existing) return existing;
    return categoriesService.create(data);
  }

  async function findOrCreateProduct(data: { name: string; description: string; price: number; stock: number; categoryId: string }) {
    const existing = await productsService.findByName(data.name);
    if (existing) return existing;
    return productsService.create({ ...data, categoryId: String(data.categoryId) });
  }

  // ====== Crear Usuarios ======
  await findOrCreateUser({ name: 'Admin Principal', email: 'admin@ecommerce.com', password: 'admin123', role: 'admin' });
  await findOrCreateUser({ name: 'Usuario Alumno 1', email: 'alumno1@ecommerce.com', password: 'alumno123', role: 'customer' });
  await findOrCreateUser({ name: 'Usuario Alumno 2', email: 'alumno2@ecommerce.com', password: 'alumno123', role: 'customer' });

  // ====== Crear Categorías ======
  const electronics = await findOrCreateCategory({
    name: 'Electrónica',
    description: 'Dispositivos, gadgets y accesorios tecnológicos',
  });

  const fashion = await findOrCreateCategory({
    name: 'Moda',
    description: 'Ropa, calzado y accesorios',
  });

  const home = await findOrCreateCategory({
    name: 'Hogar',
    description: 'Artículos para el hogar y la cocina',
  });

  const sports = await findOrCreateCategory({
    name: 'Deportes',
    description: 'Equipamiento y accesorios deportivos',
  });

  const books = await findOrCreateCategory({
    name: 'Libros',
    description: 'Libros de distintos géneros y autores',
  });

  // ====== Crear Productos ======
  const products = [
    // Electrónica
    { name: 'Laptop HP Pavilion 15"', description: 'Laptop con Intel i5, 8GB RAM, 512GB SSD', price: 850.0, stock: 10, categoryId: electronics.id },
    { name: 'Smartphone Samsung Galaxy S23', description: 'Pantalla AMOLED, 128GB almacenamiento', price: 999.99, stock: 15, categoryId: electronics.id },
    { name: 'Auriculares Sony WH-1000XM5', description: 'Auriculares inalámbricos con cancelación de ruido', price: 320.0, stock: 20, categoryId: electronics.id },
    { name: 'Mouse Logitech MX Master 3', description: 'Mouse inalámbrico ergonómico', price: 95.0, stock: 30, categoryId: electronics.id },

    // Moda
    { name: 'Zapatillas Nike Air Max 2024', description: 'Calzado deportivo edición limitada', price: 120.0, stock: 25, categoryId: fashion.id },
    { name: 'Camisa Formal Slim Fit', description: 'Camisa blanca de algodón 100%', price: 45.0, stock: 40, categoryId: fashion.id },
    { name: 'Chaqueta de cuero', description: 'Chaqueta negra estilo clásico', price: 180.0, stock: 12, categoryId: fashion.id },

    // Hogar
    { name: 'Cafetera Nespresso', description: 'Cafetera automática con cápsulas incluidas', price: 150.0, stock: 18, categoryId: home.id },
    { name: 'Juego de ollas Tramontina', description: 'Set de 5 piezas de acero inoxidable', price: 200.0, stock: 10, categoryId: home.id },
    { name: 'Aspiradora Dyson V11', description: 'Aspiradora inalámbrica con alta potencia', price: 499.0, stock: 8, categoryId: home.id },

    // Deportes
    { name: 'Balón de Fútbol Adidas', description: 'Balón oficial tamaño 5', price: 35.0, stock: 50, categoryId: sports.id },
    { name: 'Bicicleta de Montaña Trek', description: 'Bicicleta profesional con 24 cambios', price: 780.0, stock: 5, categoryId: sports.id },
    { name: 'Guantes de Box Everlast', description: 'Guantes profesionales de cuero', price: 70.0, stock: 20, categoryId: sports.id },

    // Libros
    { name: 'Cien Años de Soledad', description: 'Gabriel García Márquez - Realismo mágico', price: 25.0, stock: 35, categoryId: books.id },
    { name: 'El Señor de los Anillos', description: 'J.R.R. Tolkien - Fantasía épica', price: 40.0, stock: 15, categoryId: books.id },
    { name: 'Clean Code', description: 'Robert C. Martin - Buenas prácticas de programación', price: 50.0, stock: 10, categoryId: books.id },
  ];

  for (const product of products) {
    await findOrCreateProduct(product);
  }

  console.log('✅ Seed insertado con éxito');
  await app.close();
}

bootstrap();
