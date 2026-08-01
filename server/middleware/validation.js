function validateResource(req, res, next) {
  const errors = [];
  const { name, category, country, region, description, lat, lon } = req.body;

  if (!name || name.trim() === '') {
    errors.push('Name is required.');
  }

  if (!category || category.trim() === '') {
    errors.push('Category is required.');
  }

  if (!country || country.trim() === '') {
    errors.push('Country is required.');
  }

  if (!region || region.trim() === '') {
    errors.push('Region is required.');
  }

  if (!description || description.trim() === '') {
    errors.push('Description is required.');
  }

  if (lat === undefined || lat === null || lat === '' || Number.isNaN(Number(lat))) {
    errors.push('Latitude must be a valid number.');
  }

  if (lon === undefined || lon === null || lon === '' || Number.isNaN(Number(lon))) {
    errors.push('Longitude must be a valid number.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Invalid healthcare resource data.',
      details: errors
    });
  }

  next();
}

function validateIdParam(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'Invalid resource ID.'
    });
  }

  req.resourceId = id;
  next();
}

module.exports = {
  validateResource,
  validateIdParam
};