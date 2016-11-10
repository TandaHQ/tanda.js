module.exports = function(){
    let endpoint = '/schedules';
    
    var methods = {};
    
    /**
     * Get all schedules in the provided list
     * @param {Array} ids - List of ids to query
     * @param {boolean} show_costs - Show costs?
     */
    methods.gets = (ids, show_costs = false) => {
        var url = endpoint + '?ids=' + ids.join(',') + this._.show(show_costs, false);
        return this.request('GET', url);
    };

    /**
     * Create a schedule
     * @param {object} schedule - the object to create
     */
    methods.create = (schedule) => {
        return this.request('POST', endpoint, schedule);
    };

    /**
     * Get a schedule by schedule id
     * @param {int} id - Schedule ID to query on
     * @param {boolean} show_costs - Show Costs?
     * @returns {Promise} Resolve: the schedule.  Reject: {err: 'The error'}
     */
    methods.get = (id, show_costs = false) => {
        var url = endpoint + `/${id}` + this._.show(show_costs);
        return this.request('GET', url);
    };

    /**
     * Update a schedule, identified by a Schedule ID
     * @param {int} id - Schedule ID to update
     * @param {object} update - Data to update with
     * @returns {Promise} Resolve: the updated schedule. Reject: {err : 'The error'}
     */
    methods.update = (id, update) => {
        return this.request('PUT', `${endpoint}/${id}`, update);
    };

    /**
     * Delete a schedule
     * @param {int} id - Schedule ID to delete
     * @returns {Promise} Resolve: nothing (status 204 is success). Reject: {err : 'The error}
     */
    methods.delete = (id) => {
        return this.request('DELETE', `${endpoint}/${id}`);
    };
    
    return methods;
};