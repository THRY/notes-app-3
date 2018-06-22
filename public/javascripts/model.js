export default (function data() {
    
    function add(item) {
        window.localStorage.setItem(item.id, JSON.stringify(item));
    }

    function get(id) {
        return  JSON.parse(window.localStorage.getItem(id));
    }

    return {
        get: get,
        add: add
    }

})();