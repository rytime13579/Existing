import express from 'express';

const app = express();

const PORT = 3000;

app.get("/api/auth/signup", (req,res) => {
    res.send("Signup endpoint");
});

app.get("/api/auth/signup", (req,res) => {
    res.send("Signup endpoint");
});

app.get("/api/auth/signup", (req,res) => {
    res.send("Signup endpoint");
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))