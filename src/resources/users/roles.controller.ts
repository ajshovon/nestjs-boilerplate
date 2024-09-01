import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RoleEntity } from 'src/database/entities/role.entity';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
@UseGuards(PermissionsGuard)
@ApiBearerAuth()
@ApiTags('Users Endpoint')
@ApiResponse({ status: 500, description: 'Internal server error' })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Add New role' })
  @ApiResponse({ status: 201, description: 'Success', type: RoleEntity })
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Post('assign')
  @ApiOperation({ summary: 'Add New role' })
  @ApiResponse({ status: 201, description: 'Success', type: RoleEntity })
  @ApiResponse({
    status: 409,
    description: 'Role is already assigned to this user',
    type: RoleEntity,
  })
  assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.rolesService.assignRole(assignRoleDto);
  }

  @Delete('revoke')
  @ApiOperation({ summary: 'Revoke a role from the user' })
  @ApiResponse({ status: 201, description: 'Success', type: RoleEntity })
  @ApiResponse({
    status: 409,
    description: 'Role is already assigned to this user',
    type: RoleEntity,
  })
  revokeRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.rolesService.revokeRole(assignRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of all roles',
    type: RoleEntity,
    isArray: true,
  })
  findAllRoles() {
    return this.rolesService.findAllRoles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one role' })
  @ApiResponse({
    status: 200,
    description: 'Returns details of a role',
    type: RoleEntity,
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  findOneRole(@Param('id') id: string) {
    return this.rolesService.findOneRole(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update one role' })
  @ApiResponse({
    status: 200,
    description: 'Returns updated details of a role',
  })
  @ApiResponse({ status: 404, description: 'Role not found' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove one role' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
