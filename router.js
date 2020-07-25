const express = require('express');
const {Pool} = require('pg');

const cString = process.env.DATABASE_URL;
let pool = null;

if(process.env.ENV !== "PRODUCTION"){
    pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'urlshort',
        password: 'jd04230123',
        port: 5432,
    });
}else{
    pool = new Pool({
        connectionString: cString
    });
}


pool.query(`CREATE TABLE urls(
    slug VARCHAR ( 150 ) PRIMARY KEY,
    url VARCHAR ( 255 ) NOT NULL,
    created_on TIMESTAMP NOT NULL);`,
    (err,res)=>{
        console.log(err,res);
    }
);

const router = express.Router();

router.post("/new", async (req,res)=>{
    console.log(req.body);
    let slug = req.body.slug;
    if(slug ===  undefined || slug === "" ){
        slug = Math.random().toString(32).substring(2,10);
    }
    let query = await pool.query(`SELECT * FROM urls WHERE slug = '${slug}'`);

    if( query.rows.length >= 1){
        return res.json({
            error: "Slug en uso"
        });
    }
    query = await pool.query("INSERT INTO urls(slug, url, created_on) VALUES($1, $2, $3)",
    [slug, req.body.url, new Date()]);
    console.log(query);
    return res.json({
        status: "created",
        slug: slug
    });
});

router.get("/:id", async (req, res)=>{
    let query = await pool.query(`SELECT * FROM urls WHERE slug = '${req.params.id}'`);
    if( query.rows.length >= 1){
        return res.redirect(query.rows[0].url);
    }else{
        return res.json({
            error: "Slug no encontrado"
        });
    }
});

router.use("/", express.static("./public"));

module.exports = router;