/*
    - query params => mysite.comusers?name=martin&age=40  //FILTROS
    - route params => /users/3                            //BUSCAR, ACTUALIZAR O BORRAR ALGO ESPECIFICO DENTRO DEL USUARIO O MISMO EL USUARIO ENTERO
    - request body => {"name":"Martin", "age":}           

    - GET           =>buscar informacion en el back-end
    - POST          =>crear nueva informacion en el back-end
    - PUT / PATCH   =>cambiar/actualizar informacion en el back-end
    - DELETE        =>borrar informacion en el back-end

*/

const express = require("express");
const uuid = require("uuid");
const port = 3000;
const app = express();
const users = [];
app.use(express.json());

const checkUserId = (request, response, next) => {
  const { id } = request.params;
  const index = users.findIndex((user) => user.id === id);
  if (index < 0) {
    return response.status(404).json({ message: "User not found" });
  }

  request.userIndex = index;
  request.userId = id

  next()
};

// Middleware => INTERCEPTADOR => tiene el poder de parar o alterar datos de la requisicion

app.get("/users", (request, response) => {
  return response.json(users);
});

app.post("/users", (request, response) => {
  const { name, age } = request.body;

  // Check if name and age are provided
  if (!name || !age) {
    return response.status(400).json({ error: "Name and age are required." });
  }

  const user = { id: uuid.v4(), name, age };

  users.push(user);

  return response.status(201).json(user);
});

app.put("/users/:id", checkUserId, (request, response) => {
  const { name, age } = request.body;
  const index = request.userIndex;
  const id = request.userId

  const updatedUser = { id, name, age };

  users[index] = updatedUser;
  return response.json(updatedUser);
});

app.delete("/users/:id", checkUserId, (request, response) => {
  const index = request.userIndex;

  users.splice(index, 1);

  return response.status(204).json(users);
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
