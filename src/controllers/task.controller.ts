import { ITask } from '@src/models/task.model';
import {
  completeTask,
  create,
  deleteTasks,
  getAllTasks,
  getTask,
  inProgressTask,
  pendingTask,
  updateTask,
} from '@src/services/task.service';
import { sendTaskCreatedEmail, sendTaskStatusEmail } from '@src/services/email.service';
import { Request, Response } from 'express';

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user;
    const { title, description, status } = req.body;
    const newTask = await create({ title, description, status, user: userId });

    // Populate user data to get email and username
    const populatedTask = await getTask(newTask._id.toString());

    // Send task created email (non-blocking)
    if (populatedTask && populatedTask.user) {
      const userEmail = (populatedTask.user as any).email;
      const username = (populatedTask.user as any).username;
      sendTaskCreatedEmail(userEmail, username, title).catch(err =>
        console.error('Failed to send task created email:', err)
      );
    }

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    console.log('Error creating task', error);
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const tasks = await getAllTasks(userId);
    if (!tasks) {
      return res.status(404).json({ message: 'No tasks found' });
    }
    res.status(200).json({ message: 'Tasks fetched successfully', tasks });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
    console.log('Error fetching tasks', error);
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const task = await getTask(id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task fetched successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
    console.log('Error fetching task', error);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const { title, description, status } = req.body;
    const task = await getTask(id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const updatedTask = await updateTask(id, {
      title,
      description,
      status,
    } as ITask);
    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
    console.log('Error updating task', error);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const task = await getTask(id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await deleteTasks(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
    console.log('Error deleting task', error);
  }
};

export const markAsCompleted = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const task = await getTask(id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const complete = await completeTask(id);

    // Send task status email (non-blocking)
    if (task && task.user) {
      const userEmail = (task.user as any).email;
      const username = (task.user as any).username;
      sendTaskStatusEmail(userEmail, username, task.title, 'completed').catch(err =>
        console.error('Failed to send task status email:', err)
      );
    }

    res.status(200).json({ message: 'Task marked as complete', task: complete });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
    console.log('Error marking task as complete', error);
  }
};

export const markAsInProgress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const task = await getTask(id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const inProgress = await inProgressTask(id);

    // Send task status email (non-blocking)
    if (task && task.user) {
      const userEmail = (task.user as any).email;
      const username = (task.user as any).username;
      sendTaskStatusEmail(userEmail, username, task.title, 'in-progress').catch(err =>
        console.error('Failed to send task status email:', err)
      );
    }

    res.status(200).json({ message: 'Task marked as in-progress', task: inProgress });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
    console.log('Error marking task as in-progress', error);
  }
};

export const markAsPending = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    const task = await getTask(id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const pending = await pendingTask(id);
    res.status(200).json({ message: 'Task marked as pending', task: pending });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
    console.log('Error marking task as pending', error);
  }
};
