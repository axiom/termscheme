const colorValues = [...document.querySelectorAll("[data-color-value]")];
const colorPickers = [...document.querySelectorAll("[data-color-picker]")];
const output = document.querySelector("#output");
const schemeName = document.querySelector("#schemename");
const form = document.querySelector("#scheme-form");

function isHexColor(value) {
	return /^#[\da-f]{6}$/i.test(value);
}

function updatePreview() {
	const background = document.querySelector("#background").value;
	const foreground = document.querySelector("#foreground").value;

	if (isHexColor(background)) {
		document.querySelector("#terminal").style.backgroundColor = background;
	}
	if (isHexColor(foreground)) {
		document.querySelector("#terminal").style.color = foreground;
	}

	for (const input of colorValues) {
		const value = input.value;
		input.setAttribute("aria-invalid", String(!isHexColor(value)));
		if (isHexColor(value)) {
			document.querySelectorAll(`.${input.dataset.colorValue}`).forEach((sample) => {
				sample.style.color = value;
			});
		}
	}

	if (colorValues.every((input) => isHexColor(input.value))) {
		output.value = buildXresources();
	}
}

function buildXresources() {
	const name = schemeName.value.trim() || "colorscheme";
	const lines = [
		`! Terminal color scheme '${name}' built with TermScheme`,
		"! https://github.com/axiom/termscheme",
		`${name}.background: ${document.querySelector("#background").value}`,
		`${name}.foreground: ${document.querySelector("#foreground").value}`,
	];

	for (let i = 0; i < 16; i++) {
		lines.push(`${name}.color${i}: ${document.querySelector(`#color${i}`).value}`);
	}

	return lines.join("\n");
}

function downloadXresources() {
	if (!form.reportValidity()) {
		return;
	}

	const content = buildXresources();
	output.value = content;

	const safeName = schemeName.value.trim()
		.replace(/[^a-z\d_-]+/gi, "-")
		.replace(/^-+|-+$/g, "") || "colorscheme";
	const file = new Blob([content], { type: "text/plain;charset=utf-8" });
	const url = URL.createObjectURL(file);
	const link = document.createElement("a");
	link.href = url;
	link.download = `${safeName}.Xresources`;
	link.hidden = true;
	document.body.append(link);
	link.click();
	link.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

for (const picker of colorPickers) {
	const valueInput = document.querySelector(`[data-color-value="${picker.dataset.colorPicker}"]`);
	picker.value = valueInput.value;

	picker.addEventListener("input", () => {
		valueInput.value = picker.value;
		valueInput.setAttribute("aria-invalid", "false");
		updatePreview();
	});
}

for (const input of colorValues) {
	const picker = document.querySelector(`[data-color-picker="${input.dataset.colorValue}"]`);

	input.addEventListener("input", () => {
		const valid = isHexColor(input.value);
		input.setAttribute("aria-invalid", String(!valid));
		if (valid) {
			picker.value = input.value;
			updatePreview();
		}
	});

	input.addEventListener("blur", () => {
		if (!isHexColor(input.value)) {
			input.value = picker.value;
			input.setAttribute("aria-invalid", "false");
			updatePreview();
		}
	});
}

schemeName.addEventListener("input", updatePreview);
form.addEventListener("submit", (event) => event.preventDefault());
document.querySelector("#download").addEventListener("click", downloadXresources);

updatePreview();
