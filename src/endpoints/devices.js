module.exports = function(){
  const endpoint = '/devices';
  const methods = {};

  methods.devices = () => {
    return this.request('GET', endpoint);
  };

  methods.devices.returned = () => {
    return this.request('GET', `${endpoint}/returned`);
  };

  methods.get = (id) => {
    return this.request('GET', `${endpoint}/${id}`);
  };

  methods.update = (id, update) => {
    return this.request('PUT', `${endpoint}/${id}`, update);
  };

  methods.return = (id) => {
    return this.request('POST', `${endpoint}/${id}/return`);
  };

  return methods;

};