import { Elysia } from "elysia";

const app = new Elysia()
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
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
