// server/middleware/superAdmin.js
module.exports = function requireSuperAdmin(req, res, next) {
    // verwacht dat authAdmin al is uitgevoerd en req.admin.role bestaat
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({ message: 'Alleen superadmin toegestaan' });
    }
    next();
  };
  