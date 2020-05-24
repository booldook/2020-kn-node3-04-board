// page: 요청된 페이지
// total: 전체 게시물 수
// cnt: 세트의 개수 (1, 2, 3)/(4, 5, 6)/ (7, 8) => 3

const pager = (obj) => {
	obj.list = obj.list ? obj.list : 5;									// 한페이지에 나타날 목록 수
	obj.grp = obj.grp ? obj.grp : 3;										// 페이저에서 보여줄 페이지 갯수 (1, 2, 3):3
	obj.grpSt = 0;																			// 페이저세트의 시작 (1, 2, 3): 1
	obj.grpEd = 0;																			// 페이저세트의 마지막 (1, 2, 3): 3
	obj.first = 0;
	obj.last = 0;
	obj.prev = 0;																				// bt-prev 클릭시 이동할 페이지
	obj.next = 0;																				// bt-next 클릭시 이동할 페이지
	obj.totalPage = Math.ceil(obj.total/obj.list);			// 전체 페이지수
	obj.stIdx = (obj.page - 1) * obj.list;							// sql의 시작레코드
	obj.stIdx = (obj.stIdx > obj.total - 1) ? obj.total - 1 : obj.stIdx;
	obj.grpSt = Math.floor((obj.page - 1) / obj.grp) * obj.list + 1;
	obj.grpEd = obj.grpSt + obj.grp - 1;
	obj.grpEd = (obj.grpEd > obj.totalPage) ? obj.totalPage : obj.grpEd;
	if(obj.page > 1) {
		obj.first = 1;
		obj.prev = obj.page - 1;
	}
	if(obj.page < obj.totalPage) {
		obj.last = obj.totalPage;
		obj.next = obj.page + 1;
	}
	return obj;
}

module.exports = pager;