module.exports = function(){
  const endpoint = '/departments';

  const methods = {};

  methods.gets = () => {
    return this.request('GET', endpoint);
  };

  methods.create = (department) => {
    return this.request('POST', endpoint, department);
  };

  methods.get = (id) => {
    return this.request('GET', `${endpoint}/${id}`);
  };

  methods.update = (id, update) => {
    return this.request('PUT', `${endpoint}/${id}`, update);
  };

  methods.delete = (id) => {
    return this.request('DELETE', `${endpoint}/${id}`);
  };

  return methods
};