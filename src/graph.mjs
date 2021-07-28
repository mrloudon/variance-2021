const
    AXES_COLOUR = "#666",
    TEXT_COLOUR = "#444",
    ALERT_BLUE = "#cff4fc",
    DATUM_DISPLAY_TIME = 200,
    SQUARE_FILL = 'rgba(255,0,0,0.25)',
    SQUARE_HIGHLIGHT_FILL = 'rgba(0,0,255,0.25)',
    SQUARE_DISPLAY_TIME = 300,
    DEVIATION_DISPLAY_TIME = 200,
    DEVIATION_STROKE = 'rgb(51,51,51)',
    DEVIATION_HIGHLIGHT_STROKE = '#104E8B',
    WIDTH = 720,
    LEFT_PAD = 70,
    RIGHT_PAD = 70,
    TOP_PAD = 60,
    TICK_LENGTH = 5,
    Y_MAX = 100,
    LABEL_Y_OFFSET = 12,
    LABEL_X_OFFSET = 12,
    DATUM_RADIUS = 5,
    Y_TICKS = 5,
    Y_AXIS_HEIGHT = 360,
    X_AXIS_LENGTH = WIDTH - LEFT_PAD - RIGHT_PAD,
    Y_SCALE = Y_AXIS_HEIGHT / Y_MAX;

let canvas, params, xInterval, mean, self;

function drawTicks() {
    let i, temp;

    temp = TOP_PAD + Y_AXIS_HEIGHT + TICK_LENGTH;
    for (i = 1; i <= params.data.length; i++) {
        canvas.drawLine({
            layer: true,
            strokeStyle: AXES_COLOUR,
            strokeWidth: 2,
            x1: LEFT_PAD + i * xInterval,
            y1: TOP_PAD + Y_AXIS_HEIGHT,
            x2: LEFT_PAD + i * xInterval,
            y2: temp
        });
    }
    temp = Y_AXIS_HEIGHT / Y_TICKS;
    for (i = 0; i < Y_TICKS; i++) {
        canvas.drawLine({
            layer: true,
            strokeStyle: AXES_COLOUR,
            strokeWidth: 2,
            x1: LEFT_PAD,
            y1: i * temp + TOP_PAD,
            x2: LEFT_PAD - TICK_LENGTH,
            y2: i * temp + TOP_PAD
        });
    }
}

function drawAxes() {
    canvas.drawLine({
        layer: true,
        strokeStyle: AXES_COLOUR,
        strokeWidth: 2,
        x1: LEFT_PAD,
        y1: TOP_PAD,
        x2: LEFT_PAD,
        y2: Y_AXIS_HEIGHT + TOP_PAD,
        x3: WIDTH - RIGHT_PAD,
        y3: Y_AXIS_HEIGHT + TOP_PAD
    });
}

function drawLabels() {
    var
        i, temp;

    temp = TOP_PAD + Y_AXIS_HEIGHT + LABEL_Y_OFFSET;
    for (i = 1; i <= params.data.length; i++) {
        canvas.drawText({
            layer: true,
            fillStyle: TEXT_COLOUR,
            strokeStyle: TEXT_COLOUR,
            strokeWidth: 0,
            x: LEFT_PAD + i * xInterval,
            y: temp,
            fontSize: '10pt',
            fontFamily: 'Verdana, sans-serif',
            text: params.data[i - 1].xLabel
        });
    }
    canvas.drawText({
        layer: true,
        fillStyle: TEXT_COLOUR,
        strokeStyle: TEXT_COLOUR,
        strokeWidth: 0,
        x: LEFT_PAD + X_AXIS_LENGTH / 2,
        y: TOP_PAD + Y_AXIS_HEIGHT + 3 * LABEL_Y_OFFSET,
        fontSize: '11pt',
        fontFamily: 'Verdana, sans-serif',
        text: params.xAxisLabel
    });
    temp = Y_AXIS_HEIGHT / Y_TICKS;
    for (i = 0; i < Y_TICKS; i++) {
        canvas.drawText({
            layer: true,
            fillStyle: TEXT_COLOUR,
            strokeStyle: TEXT_COLOUR,
            strokeWidth: 0,
            fontSize: '10pt',
            x: LEFT_PAD - TICK_LENGTH - LABEL_X_OFFSET,
            y: i * temp + TOP_PAD,
            text: Y_MAX - (i * (Y_MAX / Y_TICKS))
        });
    }
    canvas.drawText({
        layer: true,
        fillStyle: TEXT_COLOUR,
        strokeStyle: TEXT_COLOUR,
        strokeWidth: 0,
        x: LEFT_PAD - 4 * LABEL_X_OFFSET,
        y: TOP_PAD + Y_AXIS_HEIGHT / 2,
        fontSize: '11pt',
        fontFamily: 'Verdana, sans-serif',
        text: params.yAxisLabel,
        rotate: 270
    });
    canvas.drawText({
        layer: true,
        fillStyle: TEXT_COLOUR,
        strokeStyle: TEXT_COLOUR,
        strokeWidth: 0,
        x: LEFT_PAD + X_AXIS_LENGTH / 2,
        y: TOP_PAD - 3 * LABEL_Y_OFFSET,
        fontSize: '14pt',
        fontFamily: 'Verdana, sans-serif',
        text: params.title
    });
}

function drawMean() {
    var
        txt = 'Mean ' + mean.toFixed(1);

    canvas.addLayer({
        type: 'line',
        index: 0,
        strokeStyle: 'green',
        strokeWidth: 1,
        x1: LEFT_PAD,
        y1: TOP_PAD + Y_AXIS_HEIGHT - Y_SCALE * mean,
        x2: LEFT_PAD + X_AXIS_LENGTH,
        y2: TOP_PAD + Y_AXIS_HEIGHT - Y_SCALE * mean
    });
    canvas.addLayer({
        type: 'text',
        visible: true,
        fillStyle: '#251',
        strokeStyle: '#25a',
        strokeWidth: 0,
        x: LEFT_PAD + 32,
        y: TOP_PAD + Y_AXIS_HEIGHT - Y_SCALE * mean + 8,
        fontSize: '8pt',
        fontFamily: 'Verdana, sans-serif',
        text: txt
    });
    canvas.drawLayers();
}

function plotData() {
    let i, timer;

    function plotDatum() {
        canvas.drawArc({
            layer: true,
            name: params.data[i].xLabel + "td",
            data: params.data[i],
            strokeStyle: '#444',
            strokeWidth: 1,
            fillStyle: ALERT_BLUE,
            x: LEFT_PAD + (i + 1) * xInterval,
            y: TOP_PAD + Y_AXIS_HEIGHT - Y_SCALE * params.data[i].yVal,
            radius: DATUM_RADIUS,
            mouseover: function (layer) {
                canvas.setLayer('message', {
                    text: layer.data.xLabel + ": " + layer.data.yVal + "%",
                    visible: true
                });
                canvas.drawLayers();
                $("#" + layer.data.xLabel + "td").css({
                    "background-color": ALERT_BLUE,
                });
            },
            mouseout: function (layer) {
                canvas.setLayer('message', {
                    visible: false
                });
                canvas.drawLayers();
                $("#" + layer.data.xLabel + "td").css({
                    "background-color": "inherit",
                });
            }
        });
        if (++i >= params.data.length) {
            clearInterval(timer);
        }
    }

    i = 0;
    timer = setInterval(plotDatum, DATUM_DISPLAY_TIME);

    canvas.addLayer({
        layer: true,
        name: 'message',
        type: 'text',
        visible: false,
        fillStyle: '#251',
        strokeStyle: '#25a',
        strokeWidth: 0,
        x: LEFT_PAD + X_AXIS_LENGTH / 2,
        y: TOP_PAD,
        fontSize: '10pt',
        fontFamily: 'Verdana, sans-serif',
        text: ''
    });

}

function setupTable() {
    const head = params.page.querySelector("thead tr");
    const body = params.page.querySelector("tbody tr");
    params.data.forEach(item => {
        const th = document.createElement("th");
        const td = document.createElement("td");
        th.innerHTML = item.xLabel;
        td.innerHTML = "&mdash;";
        td.id = `${item.xLabel}td`;
        td.addEventListener("mouseenter", evt => {
            const name = evt.currentTarget.id;
            evt.currentTarget.style.backgroundColor = ALERT_BLUE;
            canvas.setLayer(canvas.getLayer(name), {
                fillStyle: "blue"
            });
            canvas.setLayer('message', {
                text: name.slice(0,-2) + ": " + evt.currentTarget.innerHTML + "%",
                visible: true
            });
            canvas.drawLayers();
            //canvas.drawLayer("message");
        });
        td.addEventListener("mouseleave", evt => {
            const name = evt.currentTarget.id;
            evt.currentTarget.style.backgroundColor = "#fafafa";
            canvas.setLayer(canvas.getLayer(name), {
                fillStyle: "#cff4fc"
            });
            canvas.setLayer('message', {
                text: "             ",
                visible: false
            });
            canvas.drawLayers();
            //canvas.drawLayer("message");
        });
        head.appendChild(th);
        body.appendChild(td);
    });
}

function showTableData() {
    const tds = params.page.querySelectorAll("tbody tr td");
    let i;

    if (tds.length === params.data.length) {
        for (i = 0; i < tds.length; i++) {
            tds[i].innerHTML = params.data[i].yVal;
        }
    }
    console.log(tds);
}

function getMeanCalculationHTML() {
    let html, sumHtml = "",
        total = 0;
    html = "<h5>Calculating the Mean</h5>";
    params.data.forEach(item => {
        sumHtml += `${item.yVal} + `;
        total += item.yVal;
    });
    sumHtml = sumHtml.slice(0, -2);
    html += `<p><span class="math-ex">&sum; x = ${sumHtml} = ${total}</span></p>
            <p><span class="math-ex">x&#772; = &sum; x &#x2215; N = ${total} &#x2215; ${params.data.length} = ${(total / params.data.length).toFixed(1)}</span></p>
            <p>(Remember: <span class="math-ex">&sum; x</span> means "the <em>sum</em> of all the <span class="math-ex">x</span> data" 
                and <span class="math-ex">x&#772;</span> means "the <em>mean</em> of all the <span class="math-ex">x</span> data")</p>`;
    html += `<p class="mean invisible">The mean is <strong>${(total / params.data.length).toFixed(1)}</strong>. We will now plot the data and the mean.</p>`;
    return html;
}

function showMeanCalculationResult() {
    params.page.querySelector("p.mean.invisible").classList.remove("invisible");
}

function init(paramaters) {
    let sum = 0,
        i;
    params = paramaters;
    canvas = $(params.canvasID);
    xInterval = Math.floor(X_AXIS_LENGTH / (params.data.length + 1));
    for (i = 0; i < params.data.length; i++) {
        sum += params.data[i].yVal;
    }
    mean = params.data.length > 0 ? (sum / params.data.length) : 0;
    drawAxes();
    drawTicks();
    drawLabels();
    console.log(params.data);
    setupTable();
}

export {
    init,
    showTableData,
    getMeanCalculationHTML,
    showMeanCalculationResult,
    plotData,
    drawMean
};