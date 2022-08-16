import express, { json, Request, Response, urlencoded } from 'express'
import dotenv from "dotenv"
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
// prisma.$connect()

const app = express()
dotenv.config()


app.use(json())
app.use(urlencoded({extended: true}))

app.get('/feed', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  })
  return res.status(200).json(posts)
})

app.post('/post', async (req, res) => {
  const { title, content, authorEmail } = req.body
  const post = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } },
    },
  })
  return res.status(200).json(post)
})

app.put('/publish/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.update({
    where: { id },
    data: { published: true },
  })
  return res.status(200).json(post)
})

app.delete('/user/:id', async (req, res) => {
  const { id } = req.params
  const user = await prisma.user.delete({
    where: {
      id,
    },
  })
  return res.status(200).json(user)
})

const port = process.env.PORT || 5000
const server = app.listen(port)

server.on("listening", () => {
	console.log("Server running on http://localhost:" + port)
})

server.on("error", (error) => {
	console.log(error.stack)
	process.exit(1)
})