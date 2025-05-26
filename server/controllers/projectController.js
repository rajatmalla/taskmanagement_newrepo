import Project from '../models/Project.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('team', 'name email')
      .populate('tasks', 'title');
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Only admin users can create projects.' });
    }
    const { name, description } = req.body;
    const userID = req.user?.userID;
    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }
    const project = await Project.create({
      name, 
      description,
      createdBy: userID,
      team: userID ? [userID] : [],
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    console.log('DEBUG req.user:', req.user);
    console.log('DEBUG req.body:', req.body);
    // Attach full project permissions for admin
    if (req.user && req.user.role === 'admin') {
      req.user.permissions = {
        canViewAllProjects: true,
        canCreateProjects: true,
        canAddTeamMember: true,
        canEditAllProjects: true,
        canDeleteProjects: true,
        canAssignProjects: true
      };
    }
    // Role-based and permission-based access: only admin or manager with permission can add members
    const allowedRoles = ['admin', 'manager'];
    if (!req.user || !allowedRoles.includes(req.user.role) || !req.user.permissions?.canAddTeamMember) {
      console.error('Permission denied: user does not have required role or permission');
      return res.status(403).json({ message: 'Only admin or manager users with permission can edit projects.' });
    }
    const { id } = req.params;
    const { name, description, team } = req.body;
    const project = await Project.findById(id);
    if (!project) {
      console.error('Project not found:', id);
      return res.status(404).json({ message: 'Project not found' });
    }
    if (name) project.name = name;
    if (description) project.description = description;
    if (team) {
      // Filter out null values and ensure all IDs are valid
      let updatedTeam = Array.isArray(team) 
        ? team.filter(id => id !== null && id !== undefined)
        : [];
      
      // Ensure admin is always in the team
      const adminId = req.user.userID || req.user._id?.toString();
      if (adminId && !updatedTeam.includes(adminId)) {
        updatedTeam.push(adminId);
      }
      
      // Validate all team member IDs exist
      const validTeamMembers = await User.find({ _id: { $in: updatedTeam } });
      if (validTeamMembers.length !== updatedTeam.length) {
        return res.status(400).json({ message: 'One or more team members are invalid' });
      }
      
      project.team = updatedTeam;
    }
    await project.save();
    
    // Populate team information before sending response
    const populatedProject = await Project.findById(project._id)
      .populate('team', 'name email')
      .populate('tasks', 'title');
      
    res.status(200).json(populatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: 'Only admin users can delete projects.' });
    }
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 