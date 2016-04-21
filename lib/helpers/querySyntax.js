module.exports = (conf) => {
  let request = { params: {} };
  if (conf) {
    if (conf.id) { request.params.id = conf.id; }

    if (conf.fields) {
      if (Array.isArray(conf.fields)) {
        request.params.fields = conf.fields.join();
      } else if (typeof conf.fields === 'string') {
        request.params.fields = conf.fields;
      }
    }

    if (conf.query) {
      let query = conf.query;
      for (var prop in query) {

        if (query[prop].op) {
          switch (query[prop].op.toLowerCase()) {
            case 'and':
                request.params[prop] = formatConj(query[prop].value, '+AND+');
              break;
            case 'or':
              request.params[prop] = formatConj(query[prop].value, '+OR+');
              break;
            default:
              request.params[prop] = query[prop].op + ':' + query[prop].value;
          }
        } else {
          request.params[prop] = query[prop];
        }

      }
    }

    if (conf.noCache) {
      request.headers = { 'Cache-Control': 'no-cache' };
    }
  }

  return request;
};

function formatConj(queries, conjunction) {
  if (Array.isArray(queries)) {
    queries.forEach((query, index, array) => {
      array[index] = query.op + ':' + query.value;
    });
    return queries.join(conjunction);
  } else {
    return null;
  }
}