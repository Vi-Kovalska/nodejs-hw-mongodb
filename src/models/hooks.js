export const handleSaveError = (error, doc, next) => {
  const { code, name } = error;
  error.status = code === 1100 && name === 'MongoServerError' ? 409 : 400;
  next();
};

export function setUpdateSettings(next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
}
