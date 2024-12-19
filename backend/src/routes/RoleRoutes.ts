import { Router } from 'express';
import { RoleController } from '../controllers/RoleController';
import { RoleService } from '../services/domain/RoleService';
import { RoleRepository } from '../repositories/RoleRepository';
import { Database } from '../database/Database';

const router = Router();
const database = new Database();
const roleRepository = new RoleRepository(database);
const roleService = new RoleService(roleRepository);
const roleController = new RoleController(roleService);

router.post('/', (req, res, next) => roleController.createRole(req, res, next));
router.put('/:id', (req, res, next) => roleController.updateRole(req, res, next));
router.get('/:id', (req, res, next) => roleController.getRoleById(req, res, next));
router.get('/', (req, res, next) => roleController.getAllRoles(req, res, next));
router.delete('/:id', (req, res, next) => roleController.deleteRole(req, res, next));

export default router; 