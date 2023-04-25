import MUUID from "uuid-mongodb";

export function validateCartId(req, res, next) {
  const { cid } = req.params;
  try {
    MUUID.from(cid);
    next();

    return;
  } catch (error) {
    res.status(400).send({ status: "ERROR", error: `Invalid UUID: ${cid}` });
  }
}
