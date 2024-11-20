import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { swagger } from "@elysiajs/swagger";
import { jwt } from "@elysiajs/jwt";

import CustomerController from "./controllers/customer-controller";
import { UserController } from "./controllers/user-controller";

const app = new Elysia()
  .use(cors())
  .use(staticPlugin())
  .use(swagger())
  .use(
    jwt({
      name: "jwt",
      secret: "secret",
    })
  )
  //basic query
  .group("/customers", (app) =>
    app
      .get("", CustomerController.list)
      .post("", CustomerController.create)
      .put("/:id", CustomerController.update)
      .delete("/:id", CustomerController.remove)
  )

  .group("/users", (app) =>
    app.get("", UserController.list).post("", UserController.create)
  )

  .post("/login", async ({ jwt, cookie: { auth } }) => {
    const user = {
      id: 1,
      name: "John",
      username: "john",
      level: "admin",
    };
    const token = await jwt.sign(user);
    auth.set({
      value: token,
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
      path: "/profile",
    });
    return { token: token };
  })

  //get profile
  .get("/profile", ({ jwt, cookie: { auth } }) => {
    const user = jwt.verify(auth.value);
    return user;
  })
  //get log out
  .get("/logout", ({ cookie: { auth } }) => {
    auth.remove();
    return { message: "Logged out" };
  })
  //get info
  .get("/info", async ({ jwt, request }) => {
    if (request.headers.get("Authorization") === null) {
      return { message: "No Authorization header" };
    }

    const token = request.headers.get("Authorization") ?? "";

    if (token === "") {
      return { message: "No token" };
    }

    const payload = await jwt.verify(token);

    return {
      message: "Hello Elysia",
      payload: payload,
    };
  })
  // แบบที่ 1: Nested Destructuring (ที่ใช้ในโค้ด)
  .get("/customers/:id", ({ params: { id } }) => {
    return `Got id: ${id}`;
  })
  // แบบที่ 2: แยก Destructuring เป็นขั้นๆ
  .get("/customers/:id", (context) => {
    const { params } = context;
    const { id } = params;
    return `Got id: ${id}`;
  })
  // แบบที่ 3: ไม่ใช้ Destructuring
  .get("/customers/:id", (context) => {
    return `Got id: ${context.params.id}`;
  })
  .get("/", () => "Hello Elysia")
  .get("/hello", () => "Hello World")
  //get param
  .get("/hello/:name", ({ params: { name } }) => `Hello ${name}`)
  // get and multiple params
  .get(
    "/hello/:name/:age",
    ({ params: { name, age } }) => `Hello ${name} ${age}`
  )
  //get customer
  .get("/customers", () => {
    const customers = [
      { name: "John", age: 20 },
      { name: "Jane", age: 21 },
    ];
    return customers;
  })

  //get customer by id
  .get("/customers/:id", ({ params: { id } }) => {
    const customers = [
      { id: 1, name: "John", age: 20 },
      { id: 2, name: "Jane", age: 21 },
    ];
    const customer = customers.find((customer) => customer.id === Number(id));
    if (!customer) {
      return "Customer not found";
    }
    return customer;
  })

  //example http://localhost:3000/customers/query?name=John&age=20
  .get("/customers/query", ({ query: { name, age } }) => {
    return `Got query: ${name} ${age}`;
  })

  .get("/customers/status", () => {
    return new Response("ok", { status: 200 });
  })

  .post("/customers/create", ({ body }: { body: any }) => {
    const { name, age } = body;
    return `Got body: ${name} ${age}`;
  })

  .put(
    "/customers/update/:id",
    ({ params: { id }, body }: { params: { id: number }; body: any }) => {
      const { name, age } = body;
      return `Got body: ${name} ${age}`;
    }
  )

  .put(
    "/customers/updateAll/:id",
    ({
      params: { id },
      body,
    }: {
      params: { id: number };
      body: { name: string; age: number };
    }) => {
      const { name, age } = body;
      return `Got body: ${name} ${age}`;
    }
  )
  .delete("/customers/delete/:id", ({ params: { id } }) => {
    return `Got id: ${id}`;
  })

  //upload file
  .post("/upload-file", ({ body: { file } }: { body: { file: File } }) => {
    Bun.write("uploads/" + file.name, file);
    return { message: "File uploaded" };
  })

  //write file
  .get("/write-file", () => {
    Bun.write("test.txt", "Hello World");
    return { message: "File written" };
  })

  //read file
  .get("/read-file", () => {
    const file = Bun.file("test.txt");
    return file.text();
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
