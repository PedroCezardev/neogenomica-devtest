import { Request, Response, NextFunction } from 'express';
import { salaService } from '../services/sala.service';
import { createSalaDto, updateSalaDto } from '../dtos/sala.dto';

export const salaController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const salas = await salaService.findAll();
      res.json(salas);
    } catch (err) {
      next(err);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const sala = await salaService.findById(Number(req.params.id));
      res.json(sala);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createSalaDto.parse(req.body);
      const sala = await salaService.create(data);
      res.status(201).json(sala);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateSalaDto.parse(req.body);
      const sala = await salaService.update(Number(req.params.id), data);
      res.json(sala);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await salaService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
