const express = require('express');
const app = express();
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const connection = require('express-myconnection');
app.use(express.urlencoded({extended: false}))

const optionbd = {
    host : 'localhost',
    user: 'root',
    password: '',
    port: '3306',
    database: 'note_bd'
}

app.use(myConnection(mysql, optionbd, 'pool'));

app.set('view engine', 'ejs');
app.set('views', 'ihm');
app.get('/', (req, res)=>{
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query('SELECT * FROM notes', [],(erreur, resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    res.status(200).render('index', { resultat })
                }
            })
        }
    })
})

app.post("/note", (req, res)=>{
    let id = req.body.id===""? null : req.body.id;
    let titre = req.body.title;
    let desc = req.body.description;

    let reqSql = req.body.id ===null? 'INSERT INTO `notes` (`id`, `titre`, `description`) VALUES(?,?,?)': "UPDATE notes SET titre = ?, description = ? WHERE id = ?";
    let donnee = req.body.id === null?[null, titre, desc]: [titre, desc, id];
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query(reqSql, donnee,(erreur, resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    res.status(300).redirect("/");
                }
            })
        }
    })
})

app.delete('/notes/:id', (req, res)=>{
    let id = req.params.id;
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur)
        }else{
            connection.query("DELETE FROM notes WHERE id = ?", [id],(erreur, resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    res.status(200).json({routeRacine: "/"});
                }
            })
        }
    })
})

app.get('/apropos', (req, res)=>{
    res.status(200).render('apropos');
})

app.use((req, res)=>{
    res.status(404).render('pageintrouvable');;
})

app.listen(3001);
console.log("Attente des requêtes au port 3001");