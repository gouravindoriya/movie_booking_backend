import {z} from 'zod'

export const registerPayloadModal = z.object({
  name:z.string().max(255).min(2),
  email: z.email().max(255).min(2),
  password: z.string(),
});



export const loginPayloadModal = z.object({
  email: z.email(),
  password: z.string(),
});