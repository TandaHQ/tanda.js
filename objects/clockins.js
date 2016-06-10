module.exports = function(){
    let endpoint = '/clockins';

    const get = ({user_id = '', device_id = '', from, to}) => {
        if (user_id === '' && device_id === ''){
            throw Error("tanda.clockins: One of User ID or Device ID must be set.");
        }
        if (from === '' || to === ''){
            throw Error("tanda.clockins: From and To must be set.");
        }
        let query = `?from=${from}&to=${to}`;
        if (user_id !== '') query += `&user_id=${user_id}`;
        if (device_id !== '') query += `&device_id=${device_id}`;

        return this.request('GET', `${endpoint}${query}`);

    };

    return {
        get
    }
};