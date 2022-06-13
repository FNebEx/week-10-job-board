import prisma from "lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if(req.method !== 'POST' && req.method !== 'PUT') return res.status(501).end();

  const session = await getSession({ req });

  if(!session) return res.status(401).json({ message: 'Not logged in' });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if(!user) return res.status().json({ message: 'User not found'});

  if(req.method === 'PUT') {
    const job = await prisma.job.findUnique({
      where: { id: parseInt(req.body.id) }
    });

    if(job.authroId !== user.id) { res.status(401).json({ message: 'Not authorized to edit' }); }

    if(req.body.task === 'publish') {
      await prisma.job.update({
        where: { id: parseInt(req.body.id) },
        data: { published: true }
      });
    }

    if(req.body.task === 'unpublish') {
      await prisma.job.update({
        where: { id: parseInt(req.body.id) },
        data: { published: false }
      });
    }

    res.status(200).end();
    return;
  }

  if(req.method === 'POST') {
    const { description, title, salary, location } = req.body;

    if(!title) return res.status(400).json({ message: 'Missing required title '});
    if(!description) return res.status(400).json({ message: 'Missing required description '});
    if(!salary) return res.status(400).json({ message: 'Missing required salary '});
    if(!location) return res.status(400).json({ message: 'Missing required location '});

    await prisma.job.create({
      data: { 
        description, 
        title, 
        salary, 
        location ,
        author: {
          connect: { id: user.id }
        }
      },
    });

    res.status(200).end();
  }
}