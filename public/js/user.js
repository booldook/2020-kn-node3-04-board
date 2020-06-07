function joinSubmit(f) {
	if(f.userid.value.trim() === "") {
		alert("아이디를 입력하세요.");
		f.userid.focus();
		return false;
	}
	if(f.userpw.value.trim() === "") {
		alert("패스워드를 입력하세요.");
		f.userpw.focus();
		return false;
	}
	if(f.userpw2.value.trim() === "") {
		alert("패스워드를 입력하세요.");
		f.userpw2.focus();
		return false;
	}
	if(f.userpw.value.trim() !== f.userpw2.value.trim()) {
		alert("패스워드가 일치하지 않습니다.");
		f.userpw.focus();
		return false;
	}
	f.submit();
}