require("dotenv").config();
const express = require("express");
const db = require("./db");
const cors=require("cors")
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(cors());
//app.use(morgan("dev"))

/*app.use((req, res, next) =>{
    //console.log("something");
    //next();
})*/

//Routes//
//Get all
app.get("/api/v1/", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM caminhao.post");
    //console.log(results);
    res.status(200).json({
      status: "sucess",
      results: results.rows.length, //caminhao: 'teste',
      data: {
        caminhao: results.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//Get a one
app.get("/api/v1/:id", async (req, res) => {
  console.log(req.params.id);

  try {
    const results = await db.query(
      `SELECT * FROM caminhao.post WHERE id = $1`,
      [req.params.id]
    );
    //select * caminhao.post where id = req.params.id
    //console.log(results.rows[0])

    res.status(200).json({
      status: "succes",
      data: {
        caminhao: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

//Create

app.post("/api/v1/", async (req, res) => {
  console.log(req.body);
  try {
    const results = await db.query(
      "INSERT INTO caminhao.post(apelido,placa,ano,cor,rendimento) values ($1, $2, $3, $4, $5) returning *",
      [
        req.body.apelido,
        req.body.placa,
        req.body.ano,
        req.body.cor,
        req.body.rendimento,
      ]
    );
    console.log(results);
    res.status(201).json({
      status: "succes",
      data: {
        caminhao: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

/*app.post("/caminhao", async(req, res) =>{
    try{
        const { apelido_caminhao,
            placa_caminhao,
            ano_caminhao,
            cor_caminhao,
            rendimento_caminhao} = req.body;
        const newcaminhao = await pool.query("INSERT INTO caminhao ( apelido_caminhao,placa_caminhao,ano_caminhao,cor_caminhao,rendimento_caminhao) VALUES($1)",
        [ apelido_caminhao,
            placa_caminhao,
        ano_caminhao,
        cor_caminhao,
        rendimento_caminhao]
        )

        res.json(newcaminhao)
    }catch(err){
      console.log(err.menssage);
    }
    
})
*/

//update
app.put("/api/v1/:id", async (req, res) => {
  //console.log(req.params.id)
  //console.log(req.body);
  try {
    const results = await db.query(
      "UPDATE caminhao.post SET apelido = $1, placa = $2, ano = $3, cor= $4, rendimento =$5 WHERE id = $6 returning *",
      [
        req.body.apelido,
        req.body.placa,
        req.body.ano,
        req.body.cor,
        req.body.rendimento,
        req.params.id,
      ]
    );
    console.log(results);

    res.status(200).json({
      status: "succes",
      data: {
        caminhao: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(req.params.id);
  console.log(req.body);
});

//delete
app.delete("/api/v1/:id", (req, res) => {
  try {
        const results = db.query("DELETE FROM caminhao.post where id = $1", [
          req.params.id,
        ]);
  res.status(204).json({
    status: "sucess",
  });
}catch(err){
 console.log(err)
}
});

const port = process.env.PORT || 3100;

app.listen(port, () => {
  console.log(`server has started on port ${port}`);
});
