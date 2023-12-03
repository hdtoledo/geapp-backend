const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next(); 
    } else {
      res.status(403);
      throw new Error('Acceso no autorizado');
    }
  };
  
  module.exports = isAdmin;