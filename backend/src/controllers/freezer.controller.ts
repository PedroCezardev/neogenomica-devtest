import { Request, Response, NextFunction } from 'express';
import { freezerService } from '../services/freezer.service';
import { createFreezerDto, updateFreezerDto } from '../dtos/freezer.dto';

export const freezerController = {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const freezers = await freezerService.findAll();
      res.json(freezers);
    } catch (err) {
      next(err);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const freezer = await freezerService.findById(Number(req.params.id));
      res.json(freezer);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createFreezerDto.parse(req.body);
      const freezer = await freezerService.create(data);
      res.status(201).json(freezer);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateFreezerDto.parse(req.body);
      const freezer = await freezerService.update(Number(req.params.id), data);
      res.json(freezer);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await freezerService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
