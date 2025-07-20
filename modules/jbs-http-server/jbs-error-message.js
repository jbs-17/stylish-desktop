function errorMessage(error = new Error('something error!')) {
  const exception = 'jbs';
  let a = error = error.stack.split('\n');
  a = error.filter(s => !s.includes(exception)).join('\n');
  const x = new Error(error.message);
  x.stack = a;
  return x
}
export default errorMessage;
export { errorMessage };