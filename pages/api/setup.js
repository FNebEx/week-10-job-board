import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = getSession({ req });
  
  if(!session) return res.end();
  
  if(req.method === 'POST') {
    await prisma.user.update({
      where: { email: (await session).user.email },
      data: {
        name: req.body.name,
        company: req.body.company
      }
    });

    res.end();
  }
}