import request from './request';

export default {
  getSideList(value) {
    return request.get('/getsidebar', {
      params: {
        type: value,
      },
    });
  },
  getGoodsList(params) {
    return request.get('/getGoodsList', { params });
  },
  likeSearch(params) {
    return request.get('/likeSearch', { params });
  },
  search(params) {
    return request.get('/search', { params });
  },
  getGoodsByIds(params) {
    return request.get('/getGoodsByIds', { params });
  },
};
