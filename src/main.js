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
    const message = page.querySelector("p.message");
    const firstAlert = page.querySelector("div.first-alert");
    const secondAlert = page.querySelector("div.second-alert");
    const continueBtn = page.querySelector("button.continue-btn");
    const caption = page.querySelector("caption");

    let state = "show-data";
    let stats;
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

        continueBtn.disabled = true;
        switch (state) {
            case "show-data":
                Graph.showTableData();
                message.innerHTML = "&nbsp;";
                firstAlert.innerHTML = "&nbsp;";
                state = "calculate-mean";
                setTimeout(() => {
                    message.innerHTML = `Now we will calculate the mean by summing the participant scores, 
                        <span class="math-ex">x</span>, and dividing by the number of partipants, <span class="math-ex">N</span>`;
                    continueBtn.disabled = false;
                }, PAUSE);
                break;
            case "calculate-mean":
                message.innerHTML = "&nbsp;";
                firstAlert.innerHTML = Graph.getMeanCalculationHTML();
                Utility.fadeIn(firstAlert);
                state = "plot-data";
                setTimeout(() => {
                    continueBtn.disabled = false;
                    message.innerHTML = "We will now plot the data and the mean.";
                    Graph.showMeanCalculationResult();
                }, PAUSE);
                break;
            case "plot-data":
                message.innerHTML = `<p><small class="text-muted">(You can move the mouse cursor over a table entry to highlight it in the graph and vice-versa)</small></p>`;
                firstAlert.innerHTML = "&nbsp;";
                firstAlert.style.display = "none";
                Utility.fadeIn(document.getElementById("graph1"));
                Utility.wait(PAUSE)
                    .then(() => {
                        function plotDataCallback() {
                            message.innerHTML = `
                            <p><small class="text-muted">(You can move the mouse cursor over a table entry to highlight it in the graph and vice-versa)</small></p>
                            <p>Now we will calculate the deviation from the mean for each score: <span class="math-ex">( x &minus; x&#772; )</span></p>`
                            continueBtn.disabled = false;
                            state = "plot-deviations";
                        }
                        Graph.plotData(plotDataCallback);
                    });
                break;
            case "plot-deviations":
                message.innerHTML = "&nbsp;";
                Graph.showTableDeviations();
                Graph.plotDeviations(() => {
                    message.innerHTML = `
                    <p><small class="text-muted">(You can move the mouse cursor over a table entry to highlight it in the graph and vice-versa)</small></p>
                        <p>Now we will calcluate the square of each deviation from the mean: <span class="math-ex">( x &minus; x&#772; )</span>&#xb2;</p>`;
                    continueBtn.disabled = false;
                    state = "plot-squares";
                });
                break;
            case "plot-squares":
                message.innerHTML = "&nbsp;";
                Graph.showTableSquares();
                Graph.plotSquares(() => {
                    message.innerHTML = `<p><small class="text-muted">(You can move the mouse cursor over a table entry to highlight it in the graph and vice-versa)</small></p>
                        <p>Now we will calculate the sum of the squares of each deviation form the mean: <span class="math-ex">&sum; ( x &minus; x&#772; )</span>&#xb2;</p>`;
                    continueBtn.disabled = false;
                    state = "sum-squares";
                });
                break;
            case "sum-squares":
                message.innerHTML = "&nbsp;";
                firstAlert.style.display = "block";
                Graph.sumSquares(() => {
                    message.innerHTML = `Now we can calculate two kinds of variance, the <strong>population</strong> variance and the <strong>sample</strong> variance.`;
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
                it is instead divided by the <strong>size of the population minus one:</strong> <span class="math-ex">(N &minus; 1)</span>.</p>
                <p class="math-ex fs-5">s&#xb2; = &sum; ( x &minus; x&#772; )&#xb2; &#8725; ( N &minus; 1 )</p>
                <p>So, for this example, the sample variance, 
                <span class="math-ex">s&#xb2; = ${stats.sumSquares.toFixed(1)} &#8725; ${stats.N - 1}  = ${stats.sampleVar.toFixed(1)}</span></p>`;
                secondAlert.style.display = "block";
                caption.innerHTML += `<br>Population variance = <strong>${stats.populationVar.toFixed(1)}</strong>
                                    <br>Sample variance = <strong>${stats.sampleVar.toFixed(1)}</strong>`;
                setTimeout(() => {
                    message.innerHTML = "Now we will consider another measure of variance, the <strong>standard deviation</strong>.";
                    state = "calculate-standard-deviation";
                    continueBtn.disabled = false;
                }, PAUSE);
                break;
            case "calculate-standard-deviation":
                secondAlert.style.display = "none";
                message.innerHTML = "&nbsp;";
                firstAlert.innerHTML = `<h5>Standard Deviation</h5><p class="text-start">One drawback of the variance is that it's units are the <strong>square</strong> of the original units.</p>
                <p class="text-start">In our example above, the raw data had the units of percent, %, but the variance (both population and sample variance) have the units of percent squared: 
                %&#xb2;. Similarly if our raw data was instead student weights in kilograms (kg), say, then the units of the variance would be kilograms squared, kg&#xb2;.</p>
                <p class="text-start">Because the variance has different units it cannot be directly compared with the original data (or the mean of the original data). 
                For example, if the units of the original data were metres, m, the variance of the data would have the units of square metres, m&#xb2;. 
                It makes no sense to directly compare metres - a unit of length, with square metres - a unit of area.</p>
                <p class="text-start">The standard deviation is simply the <strong>square root</strong> of the appropriate variance (population or sample variance). Remember that the square root 
                'undoes' squaring so the units of the standard deviation are the same as the original data and can be directly compared with it.</p>
                <p>In the example above the population standard deviation is:<br>
                <span class="math-ex fs-5">&sigma; = &#8730;&sigma;&#xb2; = &#8730;${stats.populationVar.toFixed(1)} = ${stats.populationSD.toFixed(1)}</span></p>
                <p>and the sample standard deviation is:<br><span class="math-ex fs-5">s = &#8730;s&#xb2; = &#8730;${stats.sampleVar.toFixed(1)} = ${stats.sampleSD.toFixed(1)}</span></p>`;
                continueBtn.disabled = true;
                state = "plot-range";
                setTimeout(() => {
                    continueBtn.disabled = false;
                    message.innerHTML = "We now have a measure of variance (the standard deviation) that can be directly compared with the original data so let us plot it on our graph."
                }, PAUSE);
                break;
            case "plot-range":
                Graph.hideSquares();
                //Graph.plotRange(stats.populationSD, `Standard Deviation (population) = ${stats.populationSD.toFixed(1)}`, POP_SD_COLOUR);
                Graph.plotRanges({
                    populationSD: stats.populationSD,
                    populationLabel: `Standard Deviation (population) = ${stats.populationSD.toFixed(1)}`,
                    sampleSD: stats.sampleSD,
                    sampleLabel: `Standard Deviation (sample) = ${stats.sampleSD.toFixed(1)}`
                });
                Graph.plotPopulationRange();
                firstAlert.innerHTML = `
                    <p>
                        <button type="button" class="btn btn-secondary btn-sm population-btn">Population SD</button>
                        <button type="button" class="btn btn-secondary btn-sm sample-btn">Sample SD</button>
                    </p>
                    <p class="text-start">Notice that most of the data points fall within one SD (standard deviation) from the mean. 
                    With normally distributed data, approximately 2/3 of the data will be within 1 SD from the mean given a sufficiently large <strong>N</strong>.</p>
                    <p><small class="text-muted">Tutorial Completed</small></p>`;
                page.querySelector(".sample-btn").addEventListener("click", Graph.plotSampleRange);
                page.querySelector(".population-btn").addEventListener("click", Graph.plotPopulationRange);
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
        .then(() => setTimeout(() => message.innerHTML = "First, we will create some data to analyse. In this case, 10 random percentage scores.", PAUSE));
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