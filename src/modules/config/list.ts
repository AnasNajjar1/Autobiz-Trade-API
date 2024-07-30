const list = async () => {
  const configs = [{ id: 'auction' }, { id: 'documentFilters' }];

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Expose-Headers': 'Content-Range',
      'Content-Range': `records 0-${configs.length}/${configs.length}`,
    },
    body: JSON.stringify(configs),
  };
};

export default list;
