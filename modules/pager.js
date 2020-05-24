// page: 요청된 페이지
// total: 전체 게시물 수
// cnt: 세트의 개수 (1, 2, 3)/(4, 5, 6)/ (7, 8) => 3

const pager = (obj) => {
	obj.list = obj.list ? obj.list : 5;									// 한페이지에 나타날 목록 수
	obj.grp = obj.grp ? obj.grp : 3;										// 페이저에서 보여줄 페이지 갯수 (1, 2, 3):3
	obj.start = 0;																			// 페이저세트의 시작 (1, 2, 3): 1
	obj.end = 0;																				// 페이저세트의 마지막 (1, 2, 3): 3
	obj.prev = 0;																				// bt-prev 클릭시 이동할 페이지
	obj.next = 0;																				// bt-next 클릭시 이동할 페이지
	obj.stIdx = 0;																			// sql의 시작레코드
	return obj;
}

module.exports = pager;