import type { FastifyInstance } from "fastify"
import { FastifyTypedInstance } from "./types"
import z from "zod"
import { randomUUID } from "node:crypto"

interface User{
    id: string,
    name: string,
    email: string
}

const users : User[] = []

export async function routers(app: FastifyTypedInstance) {
    app.get("/users", {
        schema:{
            description:'Get all users',
            tag: ['users'],
            response:{  
                200:z.array(z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string()
                })).describe('List of users')
            }
        }
    }, () => {
        return users
    })

    app.post('/users', {
        schema:{
            description:'Create a new user',
            tag: ['users'],
            body: z.object({
                name: z.string().min(3).max(255),
                email: z.string().email()
            }),
            response:{
                201: z.null().describe('User created')   
            }
        }
    }, async (request, reply) => {
        const { name, email } = request.body

        users.push({
            id: randomUUID(),
            name,
            email   
        })

        return reply.status(201).send()
    })
}
