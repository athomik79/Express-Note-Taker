const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 8080;
const mainDir = path.join(__dirname, "/public");

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", function(req, res){
    res.sendFile(path.join(mainDir, "index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(mainDir, "notes.html"));
})

app.get("/api/notes", function(req, res){
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.post("/api/notes", function(req, res){
    let userNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    let noteID = (userNotes.length).toString();
    newNote.id = noteID;
    userNotes.push(newNote);
    // userNotes.push(newNote);
    fs.writeFileSync("./db/db.json", JSON.stringify(userNotes));
    console.log("Note saved to db", newNote);
    res.json(userNotes);
})

app.delete("/api/notes/:id", function(req, res){
    let userNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note ID ${noteID}`);
    userNotes = userNotes.filter(currNote => {
        return currNote.id !=noteID;
    })

    for (currNote of userNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(userNotes));
    res.json(userNotes);
})

app.listen(port, function() {
    console.log(`Now listening on port ${port}`);
})