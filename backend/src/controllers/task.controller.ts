import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  completed: z.boolean().optional()
});

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = taskSchema.parse(req.body);
    const userId = req.user!.id;

    const task = await prisma.task.create({
      data: {
        ...validatedData,
        userId
      }
    });

    res.status(201).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;

    // Admins can see all tasks, Users only their own
    const tasks = role === 'ADMIN' 
      ? await prisma.task.findMany({ include: { user: { select: { email: true } } } })
      : await prisma.task.findMany({ where: { userId } });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = taskSchema.partial().parse(req.body);
    const userId = req.user!.id;
    const role = req.user!.role;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (role !== 'ADMIN' && task.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: validatedData
    });

    res.json(updatedTask);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;

    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (role !== 'ADMIN' && task.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await prisma.task.delete({ where: { id } });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
