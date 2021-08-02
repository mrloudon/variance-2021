import * as Utility from "./utility.mjs";
import * as Graph from "./graph.mjs";

const tasks = [doCalculatorPage, doTutorialPage];

function doCalculatorPage() {
    const page = document.getElementById("first-page");
    const tableBody = page.querySelector("tbody");
    const addRowBtn = page.querySelector("button.add-row");
    const deleteRowBtn = page.querySelector("button.delete-row");
    const calculateBtn = page.querySelector("button.calculate");
    const tutorialBtn = page.querySelector("button.variance-tutorial");
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
                if (data.length > 1) {
                    sampleVariance = sumOfSquares / (data.length - 1);
                    sampleStandardDeviation = Math.sqrt(sampleVariance);
                    sampleVarianceTD.innerHTML = sampleVariance.toFixed(3);
                    sampleStandardDeviationTD.innerHTML = sampleStandardDeviation.toFixed(3);
                }
                else {
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

    function tutorialBtnClick() {
        contentEditables = tableBody.querySelectorAll("td[contenteditable='true']");
        contentEditables.forEach(element => {
            element.removeEventListener("keydown", contentEditableKeyDown);
            element.removeEventListener("click", contentEditableClick);
        });
        addRowBtn.removeEventListener("click", addRowBtnClick);
        deleteRowBtn.removeEventListener("click", deleteRowBtnClick);
        calculateBtn.removeEventListener("click", calculateBtnClick);
        tutorialBtn.removeEventListener("click", tutorialBtnClick);
        Utility.fadeOut(page)
            .then(nextTask);
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
        tutorialBtn.addEventListener("click", tutorialBtnClick);
    }

    initialisePage();

    Utility.fadeIn(page)
        .then(initialisePage);
}

function doTutorialPage() {
    const PAUSE = 500;
    const page = document.getElementById("tutorial-page");
    const firstAlert = page.querySelector("div.first-alert");
    const secondAlert = page.querySelector("div.second-alert");
    const continueBtn = page.querySelector("button.continue-btn");

    let state = "show-data";
    //let state = "calculate-variance";

    function generateData(n, min, max) {
        let
            i, data = [];

        function Datum(xLabel, yVal) {
            this.xLabel = xLabel;
            this.yVal = yVal;
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        for (i = 1; i <= n; i++) {
            data.push(new Datum(("P" + i), getRandomInt(min, max)));
        }
        return data;
    }

    function continueClick() {
        let stats;
        continueBtn.disabled = true;
        switch (state) {
            case "show-data":
                Graph.showTableData();
                firstAlert.innerHTML = "&nbsp;";
                state = "calculate-mean";
                setTimeout(() => {
                    firstAlert.innerHTML = `Now we will calculate the mean by summing the participant scores, 
                        <span class="math-ex">x</span>, and dividing by the number of partipants, <span class="math-ex">N</span>`;
                    continueBtn.disabled = false;
                }, PAUSE);
                break;
            case "calculate-mean":
                firstAlert.innerHTML = Graph.getMeanCalculationHTML();
                state = "plot-data";
                setTimeout(() => {
                    continueBtn.disabled = false;
                    Graph.showMeanCalculationResult();
                }, PAUSE);
                break;
            case "plot-data":
                firstAlert.innerHTML = "&nbsp;";
                Utility.fadeIn(document.getElementById("graph1"));
                Utility.wait(PAUSE)
                    .then(() => {
                        function plotDataCallback() {
                            firstAlert.innerHTML = `<p>Now we will calculate the deviation from the mean for each score<br>
                            <span class="math-ex">( x &minus; x&#772; )</span></p>
                            <p><small class="text-muted">(You can move the mouse cursor over a table entry to highlight it in the graph and vice-versa)</small></p>`;
                            continueBtn.disabled = false;
                            state = "plot-deviations";
                        }
                        Graph.plotData(plotDataCallback);
                    });
                break;
            case "plot-deviations":
                firstAlert.innerHTML = "&nbsp;";
                Graph.showTableDeviations();
                Graph.plotDeviations(() => {
                    firstAlert.innerHTML = `<p>Now we will calcluate the square of each deviation from the mean<br>
                        <span class="math-ex">( x &minus; x&#772; )</span>&#xb2;</p>
                        <p><small class="text-muted">(You can move the mouse cursor over a table entry to highlight it in the graph and vice-versa)</small></p>`;
                    continueBtn.disabled = false;
                    state = "plot-squares";
                });
                break;
            case "plot-squares":
                firstAlert.innerHTML = "&nbsp;";
                Graph.showTableSquares();
                Graph.plotSquares(() => {
                    firstAlert.innerHTML = `
                        <p>Now we will calculate the sum of the squares of each deviation form the mean<br><span class="math-ex">&sum; ( x &minus; x&#772; )</span>&#xb2;</p>
                        <p><small class="text-muted">(You can move the mouse cursor over a table entry to highlight it in the graph and vice-versa)</small></p>`;
                    continueBtn.disabled = false;
                    state = "sum-squares";
                });
                break;
            case "sum-squares":
                Graph.sumSquares(() => {
                    state = "calculate-variance";
                    continueBtn.disabled = false;
                });
                break;
            case "calculate-variance":
                stats = Graph.getStats();
                firstAlert.innerHTML = `<h5>Population Variance</h5>
                <p class="text-start">If our data (the <span class="math-ex">x</span>'s) encompasses the <strong>entire population</strong> we are interested in, 
                then the variance is the sum of the squared deviations from the mean divided by the size of the population, <span class="math-ex fw-bold">N</span>.</p>
                <p class="math-ex fs-5">&sigma;&#xb2; = &sum; ( x &minus; x&#772; )&#xb2; &#8725; N</p>
                <p>So, for this example, the population variance, 
                <span class="math-ex">&sigma;&#xb2; = ${stats.sumSquares.toFixed(1)} &#8725; ${stats.N}  = ${stats.populationVar.toFixed(1)}</span></p>`;
                secondAlert.innerHTML = `<h5>Sample Variance</h5>
                <p class="text-start">If our data (the <span class="math-ex">x</span>'s) is only a <strong>sample</strong> of a larger population,
                the variance calculation changes slightly. Instead of dividing the sum of the squared deviations from the mean by <span class="math-ex fw-bold">N</span>
                it is instead divided by the size of the population divided <strong>minus one:</strong> <span class="math-ex">(N &minus; 1)</span>.</p>
                <p class="math-ex fs-5">s&#xb2; = &sum; ( x &minus; x&#772; )&#xb2; &#8725; ( N &minus; 1 )</p>
                <p>So, for this example, the sample variance, 
                <span class="math-ex">&sigma;&#xb2; = ${stats.sumSquares.toFixed(1)} &#8725; ${stats.N - 1}  = ${stats.sampleVar.toFixed(1)}</span></p>`;
                secondAlert.style.display = "block";
                break;
        }
    }

    Graph.init({
        canvasID: "#graph1",
        title: "Particpant Scores",
        xAxisLabel: "Participant ID",
        yAxisLabel: "Score (%)",
        page,
        data: generateData(10, 5, 95)
    });

    continueBtn.addEventListener("click", continueClick);
    Utility.fadeIn(page)
        .then(() => setTimeout(() => firstAlert.innerHTML = "First, we will create some data to analyse. In this case, 10 random percentage scores.", PAUSE));
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