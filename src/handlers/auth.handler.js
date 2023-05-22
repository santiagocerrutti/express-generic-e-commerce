import { UserManager } from "../dao/db/user.manager.js";

export async function postRegister(req, res) {
  try {
    const manager = new UserManager();
    const result = await manager.createUser(req.body);
    res.status(201).send({ status: "SUCCESS", payload: result });
  } catch (error) {
    if (error.code === "DUPLICATED_KEY") {
      res.status(409).send({ status: "ERROR", error: error.message });

      return;
    }

    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}

export async function postLogin(req, res) {
  try {
    const { email, password } = req.body;
    const manager = new UserManager();
    const user = await manager.getUserByEmailAndPassword(email, password);

    if (user) {
      // Al validar que usuario y contraseña son correctos, en el objeto sesión (que se mantiene a nivel global),
      // se crea un atributo user; de esta forma identificamos que esa sesión corresponde a un usuario logeado.
      // por cada cliente se crea una sesión, la diferencia está en que los usuarios logueados tendrán datos adicionales en su sesión.
      // La sesión se mantiene hasta que sea destruida (o hasta que expire).
      // ver: https://www.npmjs.com/package/express-session
      delete user["password"];
      const role = user.email === "santiago@cerrutti.com" ? "admin" : "user";
      req.session.user = {
        ...user,
        role,
      };
      res.status(200).send({ status: "SUCCESS", message: "Authenticated." });

      return;
    }

    res.status(401).send({ status: "ERROR", error: "Invalid User" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}

export async function postLogout(req, res) {
  try {
    req.session.destroy();
    res.status(200).send({ status: "SUCCESS", message: "Logout successfull." });

    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "ERROR", error: "Internal Server Error" });
  }
}
