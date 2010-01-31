function builderInit()
{
	$("#output").hide();
};

function builderUpdateColors()
{
	$("#output").hide();
	$("#terminal").css("background", "#" + $("#background").val());
	$("#terminal").css("color", "#" + $("#foreground").val());

	for (var i = 0; i < 16; i++) {
		$(".color" + i).css("color", "#" + $("#color" + i).val());
	}
};

function builderDownloadColors()
{
	var name = $("#schemename").val();
	var xres;

	xres  = "! Terminal color scheme '" + name + "' built at\n";
	xres += "! http://antiklimax.se/projects/colorschemebuilder/" + '\n';

	xres += name + ".background: #" + $("#background").val() + '\n';
	xres += name + ".foreground: #" + $("#foreground").val() + '\n';

	for (var i = 0; i < 16; i++) {
		xres += name + ".color" + i + ": #" + $("#color" + i).val() + '\n';
	}

	var out = $("#output");
	out.val(xres);
	out.show();
	out.focus().select();
};
