let input = document.querySelectorAll("#salary");
let form = document.querySelector("form");
let calculateBtn = document.querySelector("#calculate");
let payPeriod = form.elements["payperiod"];
let basicSalary = form.elements["basicSalary"];
let allowances = form.elements["allowances"];
let deductNssf = form.elements["deductnssf"];
let nssfRates = form.elements["nssftiered"];
let deductNhif = form.elements["deductnhif"];
let newNssfRates = document.querySelector("#newnssf");
let oldNssfRates = document.querySelector("#oldnssf");
let disablerates = document.querySelector("#deductnssfno");
let enablerates = document.querySelector("#deductnssfyes");
let backCalc = document.querySelector("#back");
let front = document.querySelector("#front");
let largeMoney = document.querySelector("#largeMoney");
let Relief = document.querySelector("#taxReliefMoney");
let NetPaye = document.querySelector("#netPaye");

input.forEach((input) => {
	input.addEventListener("change", function () {
		this.value = !"" ? toFix(this.value).toLocaleString() : "";
	});
	input.addEventListener("input", function () {
		this.value = this.value.replace(/[^0-9 \.\,]/, "");
	});
});

function toFix(num) {
	return parseFloat(parseFloat(num).toFixed(2));
}

// console.log(payPeriod.value);
// console.log(basicSalary.value);
// console.log(allowances.value);
// console.log(deductNssf.value);
// console.log(nssfRates.value);
// console.log(deductNhif.value);

calculateBtn.addEventListener("click", () => {
	let incomeBeforeDeduct = removeCommas(basicSalary.value);
	let nssf = 0;
	let incomeAfterPensiondeduct = removeCommas(basicSalary.value);
	let benefitsInKind = 0;
	let taxableIncome;
	let taxOnTaxableIncome;
	let personalRelief;
	let taxOffRelief;
	let paye;
	let chargeableIncome;
	let nhifContrib;
	let netPay;

	if (deductNhif.value) {
		if (payPeriod.value === "selectedMonth") {
			console.log("hurrray you selected month");
			if (deductNssf.value === "deductnssfyes") {
				if (nssfRates === "chosenewnssf") {
					nssf = calculateNsssf(basicSalary.value);
					incomeAfterPensiondeduct -= nssf;
					taxableIncome = incomeAfterPensiondeduct;
				} else {
					nssf = 200;
					incomeAfterPensiondeduct -= nssf;
					taxableIncome = incomeAfterPensiondeduct;
				}
			} else {
				taxableIncome = incomeAfterPensiondeduct;
			}
			if (allowances.value) {
				benefitsInKind = removeCommas(allowances.value);
				taxableIncome += benefitsInKind;
			}
			taxOnTaxableIncome = calculateTax(taxableIncome);
			personalRelief = 2400;
			taxOffRelief = taxOnTaxableIncome - personalRelief;
			paye = taxOffRelief;
			chargeableIncome = taxableIncome;
			nhifContrib = calculateNhif(chargeableIncome);
			netPay = chargeableIncome - (taxOffRelief + nhifContrib);
		} else {
			console.log("hurray you selected year");
			if (deductNssf.value === "deductnssfyes") {
				if (nssfRates.value === "chosenewnssf") {
					nssf = calculateNsssf(basicSalary.value) * 12;
					console.log(nssf);
					incomeAfterPensiondeduct -= nssf;
					taxableIncome = incomeAfterPensiondeduct;
				} else {
					nssf = incomeBeforeDeduct >= 3000 ? 200 * 12 : 0;
					incomeAfterPensiondeduct -= nssf;
					taxableIncome = incomeAfterPensiondeduct;
				}
			} else {
				taxableIncome = incomeAfterPensiondeduct;
			}
			if (allowances.value) {
				benefitsInKind = removeCommas(allowances.value);
				taxableIncome += benefitsInKind;
			}
			taxOnTaxableIncome = calculateTaxAnnual(taxableIncome);
			personalRelief = incomeBeforeDeduct >= 3000 ? 28800 : 0;
			taxOffRelief = taxOnTaxableIncome - personalRelief;
			paye = taxOffRelief;
			chargeableIncome = taxableIncome;
			nhifContrib =
				incomeBeforeDeduct >= 3000
					? calculateNhif(chargeableIncome / 12) * 12
					: 0;
			netPay = chargeableIncome - (taxOffRelief + nhifContrib);
		}

		largeMoney.textContent = `ksh ${taxOffRelief}`;
		Relief.textContent = `ksh ${personalRelief}`;
		NetPaye.textContent = `ksh ${netPay}`;

		backCalc.innerHTML = `
            <h3 class="heading pb-3 mb-4">CALCULATIONS</h3>
						<table
							class="table table-dark table-bordered border-white table-striped table-hover"
						>
							<thead class="table-primary text-dark">
								<tr>
									<th scope="col">#</th>
									<th scope="col">Info</th>
									<th scope="col">Amount</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="row">1</th>
									<td>INCOME BEFORE PENSION DEDUCTION</td>
									<td>Ksh ${incomeBeforeDeduct}</td>
								</tr>
								<tr>
									<th scope="row">2</th>
									<td>DEDUCTIBLE NSSF</td>
									<td>Ksh ${nssf}</td>
								</tr>
								<tr>
									<th scope="row">3</th>
									<td>INCOME AFTER PENSION DEDUCTIONS</td>
									<td>Ksh ${incomeAfterPensiondeduct}</td>
								</tr>
								<tr>
									<th scope="row">4</th>
									<td>BENEFITS IN KIND</td>
									<td>Ksh ${benefitsInKind}</td>
								</tr>
								<tr>
									<th scope="row">5</th>
									<td>TAXABLE INCOME</td>
									<td>Ksh ${taxableIncome}</td>
								</tr>
								<tr>
									<th scope="row">6</th>
									<td>TAX ON TAXABLE INCOME</td>
									<td>Ksh ${taxOnTaxableIncome}</td>
								</tr>
								<tr>
									<th scope="row">8</th>
									<td>PERSONAL RELIEF</td>
									<td>Ksh ${personalRelief}</td>
								</tr>
								<tr>
									<th scope="row">9</th>
									<td>TAX NET OFF RELIEF</td>
									<td>Ksh ${taxOffRelief}</td>
								</tr>
								<tr>
									<th scope="row">10</th>
									<td>PAYE</td>
									<td>Ksh ${paye}</td>
								</tr>
								<tr>
									<th scope="row">11</th>
									<td>CHARGEABLE INCOME</td>
									<td>Ksh ${chargeableIncome}</td>
								</tr>
								<tr>
									<th scope="row">12</th>
									<td>NHIF CONTRIBUTION</td>
									<td>Ksh ${nhifContrib}</td>
								</tr>
								<tr>
									<th scope="row">11</th>
									<td>NET PAY</td>
									<td class="money">Ksh ${netPay}</td>
								</tr>
							</tbody>
						</table>
                        <button class="btn btn-danger" onclick="hideCalculations()">
								back
							</button>`;
		document.querySelector("#calculator").disabled = false;
		basicSalary.value = "";
		allowances.value = "";
		document.querySelector('input[name="payperiod"]:checked').checked = false;
		document.querySelector('input[name="deductnssf"]:checked').checked = false;
		document.querySelector('input[name="nssftiered"]:checked').checked = false;
		document.querySelector('input[name="deductnhif"]:checked').checked = false;
	}
});
disablerates.addEventListener("click", () => {
	newNssfRates.disabled = true;
	oldNssfRates.disabled = true;
});
enablerates.addEventListener("click", () => {
	newNssfRates.disabled = false;
	oldNssfRates.disabled = false;
});
function calculateNsssf(bsalary) {
	let bs = removeCommas(bsalary);
	console.log(bs);
	if (bs >= 18000) return 1080;
	if (bs > 6000) return compute(bs);
	if (bs >= 3000) return 0.06 * bs;
	return 0;
}
function removeCommas(str) {
	return str.indexOf(",") !== -1 ? parseFloat(str.replace(/,/g, "")) : str;
}

function compute(num) {
	let x = (num - 6000) * 0.06;
	return 360 + x;
}
function calculateTax(amount) {
	if (amount > 47059) return 0.3 * amount;
	else if (amount > 35472) return 0.25 * amount;
	else if (amount > 23885) return 0.2 * amount;
	else if (amount > 12298) return 0.15 * amount;
	else return 0.1 * amount;
}
function calculateNhif(amount) {
	if (amount > 99999) return 1700;
	else if (amount > 89999) return 1600;
	else if (amount > 79999) return 1500;
	else if (amount > 69999) return 1400;
	else if (amount > 59999) return 1300;
	else if (amount > 49999) return 1200;
	else if (amount > 44999) return 1100;
	else if (amount > 39999) return 1000;
	else if (amount > 34999) return 950;
	else if (amount > 29999) return 900;
	else if (amount > 24999) return 850;
	else if (amount > 19999) return 750;
	else if (amount > 14999) return 600;
	else if (amount <= 14999) return 500;
	else return 500;
}
function calculateTaxAnnual(amount) {
	if (amount > 564709) return 0.3 * amount;
	else if (amount > 425666) return 0.25 * amount;
	else if (amount > 286623) return 0.2 * amount;
	else if (amount > 147580) return 0.15 * amount;
	else return 0.1 * amount;
}
function showCalculations() {
	backCalc.style.display = "block";
	backCalc.style.animation = "fadeIn 2s";
	front.style.display = "none";
	front.style.animation = "fadeOut 2s";
}
function hideCalculations() {
	backCalc.style.display = "none";
	front.style.display = "block";
	backCalc.style.animation = "fadeOut 2s";
	front.style.animation = "fadeIn 2s";
}
