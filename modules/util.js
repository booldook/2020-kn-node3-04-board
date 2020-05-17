const alert = (msg, location = null) => {
	return `
	<script>
	alert("${msg}");
	${location ? "location.href = '"+location+"';" : ";"}
	</script>`;
}
module.exports = { alert }
