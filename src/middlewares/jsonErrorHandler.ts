import bodyParser from "body-parser";
import type { Request, Response } from "express";

const jsonErrorHandler = bodyParser.json({
  verify: (req:Request, res:Response, buf:Buffer, encoding:BufferEncoding) => {
    try {
      JSON.parse(buf.toString(encoding));
    } catch (e:any) {
      res.status(400).send({
        message: "There was a syntax error in your JSON request.",
        error: e.message,
        ok: false,
      });
      throw e;
    }
  },
});

export default jsonErrorHandler;
