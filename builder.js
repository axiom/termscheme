function builderUpdateColors()
{
	$("#terminal").css("background", "#" + $("#background").val());
	$("#terminal").css("color", "#" + $("#foreground").val());

	for (var i = 0; i < 16; i++) {
		$(".color" + i).css("color", "#" + $("#color" + i).val());
	}
};
