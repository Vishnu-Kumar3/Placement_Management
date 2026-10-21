export function notFound(req, res) { res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` }); }
export function errorHandler(err, _req, res, _next) {
  console.error(err);
  if (err.code === 11000) return res.status(409).json({ message: 'A record with those unique details already exists.' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors).map(e => e.message).join(' ') });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid record ID.' });
  if (err.name === 'MulterError') return res.status(400).json({ message: err.message });
  res.status(err.status || 500).json({ message: err.status ? err.message : 'Unexpected server error.' });
}
