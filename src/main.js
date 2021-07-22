import * as Utility from "./utility.mjs";

const tasks = [doCalculatorPage, doTutorialPage];

function doCalculatorPage() {
    const page = document.getElementById("first-page");
    const tableBody = page.querySelector("tbody");
    const addRowBtn = page.querySelector("button.add-row");
    const deleteRowBtn = page.querySelector("button.delete-row");
    const calculateBtn = page.querySelector("button.calculate");
    const xBarSpan = page.querySelector("#x-bar");
    const nTD = page.querySelector("table.general td.N");
    const sumTD = page.querySelector("table.general td.sum");
    const meanTD = page.querySelector("table.general td.mean");
    const squaredTD = page.querySelector("table.general td.squared");
    const populationVarianceTD = page.querySelector("table.population td.variance");
    const populationStandardDeviationTD = page.querySelector("table.population td.standard-deviation");
    const sampleVarianceTD = page.querySelector("table.sample td.variance");
    const sampleStandardDeviationTD = page.querySelector("table.sample td.standard-deviation");

    let rows = [], currentContentEditable = 0, contentEditables = [];

    function contentEditableClick(evt) {
        currentContentEditable = parseInt(evt.currentTarget.dataset.index) - 1;
    }

    function contentEditableKeyDown(evt) {
        switch (evt.code) {
            case "ArrowUp":
                if (currentContentEditable > 0) {
                    currentContentEditable--;
                    contentEditables[currentContentEditable].focus();
                }
                break;

            case "Enter":
                evt.preventDefault();

            case "ArrowDown":
                if (currentContentEditable < contentEditables.length - 1) {
                    currentContentEditable++;
                    contentEditables[currentContentEditable].focus();
                }
                break;
        }
    }

    function addRow(n) {
        const rowHtml = `
            <tr>
                <td class="text-center">${n}</td>
                <td contenteditable="true" data-index="${n}" class="fw-bold text-success"></td>
                <td class="text-center deviation"></td>
                <td class="text-center squared"></td>
            </tr>`.trim();

        tableBody.innerHTML += rowHtml;
    }

    function deleteRow() {
        if (rows.length > 1) {
            tableBody.removeChild(rows[rows.length - 1]);
            rows = tableBody.querySelectorAll("tr");
            contentEditables = tableBody.querySelectorAll("td[contenteditable='true']");
        }
    }

    function deleteRowBtnClick() {
        deleteRow();
    }

    function addRowBtnClick() {
        addRow(rows.length + 1);
        rows = tableBody.querySelectorAll("tr");
        contentEditables = tableBody.querySelectorAll("td[contenteditable='true']");
        currentContentEditable = contentEditables.length - 1;
        contentEditables[currentContentEditable].focus();
        contentEditables.forEach(element => {
            element.addEventListener("keydown", contentEditableKeyDown);
            element.addEventListener("click", contentEditableClick);
        });
    }

    function calculateBtnClick() {
        const data = [];

        function doStats() {
            let mean = 0, sum = 0, sumOfSquares = 0;
            let populationVariance = 0, populationStandardDeviation = 0;
            let sampleVariance = 0, sampleStandardDeviation = 0;
            data.forEach(item => sum += item.value);

            if (data.length > 0) {
                mean = sum / data.length;
                xBarSpan.innerHTML = mean.toFixed(3);
                rows.forEach(item => {
                    item.querySelector(".deviation").innerHTML = "";
                });
                data.forEach(item => {
                    const deviation = item.value - mean;
                    const deviationSquared = deviation * deviation;
                    sumOfSquares += deviationSquared;
                    rows[item.index].querySelector(".deviation").innerHTML = deviation.toFixed(3);
                    rows[item.index].querySelector(".squared").innerHTML = deviationSquared.toFixed(3);
                });
                nTD.innerHTML = data.length;
                sumTD.innerHTML = sum.toFixed(3);
                meanTD.innerHTML = mean.toFixed(3);
                squaredTD.innerHTML = sumOfSquares.toFixed(3);
                populationVariance = sumOfSquares / data.length;
                populationStandardDeviation = Math.sqrt(populationVariance);
                populationVarianceTD.innerHTML = populationVariance.toFixed(3);
                populationStandardDeviationTD.innerHTML = populationStandardDeviation.toFixed(3);
                if(data.length > 1){
                    sampleVariance = sumOfSquares / (data.length - 1);
                    sampleStandardDeviation = Math.sqrt(sampleVariance);
                    sampleVarianceTD.innerHTML = sampleVariance.toFixed(3);
                    sampleStandardDeviationTD.innerHTML = sampleStandardDeviation.toFixed(3);
                }
                else{
                    sampleVarianceTD.innerHTML = "&mdash;";
                    sampleStandardDeviationTD.innerHTML = "&mdash;";
                }
            }
            else {
                xBarSpan.innerHTML = "&mdash;";
            }
        }

        for (let i = 0; i < contentEditables.length; i++) {
            const value = Number.parseFloat(contentEditables[i].innerHTML);
            if (!isNaN(value)) {
                data.push({
                    value,
                    index: i
                });
            }
        }
        console.log(data);
        doStats();
    }

    function initialisePage() {
        let i;

        tableBody.innerHTML = "";
        for (i = 0; i < 5; i++) {
            addRow(i + 1);
        }
        rows = tableBody.querySelectorAll("tr");
        currentContentEditable = 0;
        contentEditables = tableBody.querySelectorAll("td[contenteditable='true']");
        contentEditables[currentContentEditable].focus();
        contentEditables.forEach(element => {
            element.addEventListener("keydown", contentEditableKeyDown);
            element.addEventListener("click", contentEditableClick);
        });
        addRowBtn.addEventListener("click", addRowBtnClick);
        deleteRowBtn.addEventListener("click", deleteRowBtnClick);
        calculateBtn.addEventListener("click", calculateBtnClick);
    }

    initialisePage();

    Utility.fadeIn(page)
        .then(initialisePage);
}

function doPage2() {
    const page = document.getElementById("second-page");
    const nextBtn = page.querySelector("button.btn-primary");

    function nextClick() {
        nextBtn.removeEventListener("click", nextClick);
        Utility.fadeOut(page).then(nextTask);
    }

    nextBtn.addEventListener("click", nextClick);
    Utility.fadeIn(page);
}

function nextTask(result) {
    const task = tasks.shift();
    if (task) {
        task(result);
    }
    else {
        console.log("No more tasks.");
    }
}

function run() {
    console.log("Running.");
    nextTask();
}

Utility.ready(run);