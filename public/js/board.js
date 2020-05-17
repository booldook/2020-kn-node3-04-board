function onSubmit(f) {
	if(f.title.value.trim() === "") {
		alert("제목을 입력하세요");
		f.title.focus();
		return false;
	}
	if(f.writer.value.trim() === "") {
		alert("작성자를 입력하세요");
		f.writer.focus();
		return false;
	}
	if(f.content.value.trim() === "") {
		alert("내용을 입력하세요");
		f.content.focus();
		return false;
	}
	return true;
}

document.querySelectorAll(".board-link").forEach(function(v) {
	v.addEventListener("click", function(){
		location.href = "/board/view/" + this.dataset.id;
	});
});