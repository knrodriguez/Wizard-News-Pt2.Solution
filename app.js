const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");
const postList = require("./views/postList");
const postDetails = require("./views/postDetails");
const client = require("./db");

const app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + "/public"));

//since our routes / and /posts/:id have similar, we can save the string that the routes share
const postsQuery = 'SELECT * FROM posts INNER JOIN users ON posts.userid = users.id';
const upvotesQuery = 'SELECT postId, COUNT(*) as upvotes FROM upvotes GROUP BY postId';

app.get("/", async (req, res) => {
  try {
    const data = await client.query(`${postsQuery} INNER JOIN (${upvotesQuery}) AS upvotes ON posts.id = upvotes.postId`);
    const posts = data.rows;
    res.send(postList(posts));
  } catch (error) {
    console.error('Error occured:', error);
  }
});

app.get("/posts/:id", async (req, res) => {
  try {
    const data = await client.query(`${postsQuery} WHERE posts.id=$1`, [req.params.id])
    const post = data.rows[0];
    res.send(postDetails(post));
  } catch (error) {
    console.error('Error occured:', error);
  }
});

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});