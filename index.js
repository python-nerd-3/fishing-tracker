let fishType = "bluegill"
let catches = []
let bluegillCatches = []
let bassCatches = []
let scl = {"bluegill": bluegillCatches, "bass": bassCatches}

function mean(array) {
    return (array.reduce((sum, i) => sum + i, 0)) / array.length // ty stack overflow
}

function median(array) {
    array = array.sort((a, b) => a - b)
    let arrayMid = (array.length / 2) - 0.5
    return arrayMid % 1 == 0 ? array[arrayMid] : mean([array[arrayMid - 0.5], array[arrayMid + 0.5]])
}

function $g(x, y, rt=false) {
    let selectString = `table > tbody > tr:nth-of-type(${y + 1}) > td:nth-of-type(${x})`
    return rt ? selectString : $(selectString)
}

function setFish(type) {
    fishType = type
    $("." + type + "-button").css("background-color", "#00aaaa")
    type == "bluegill" ? $(".bass-button").css("background-color", "#003377") : $(".bluegill-button").css("background-color", "#003377")
}

function submitFish(loc) {
    let submitRow = $(loc).parents()[1]
    let largestBluegill = parseFloat(submitRow.children[1].innerHTML) || 0
    let largestBass = parseFloat(submitRow.children[2].innerHTML) || 0
    catches.push(new Fish(submitRow.children[0].children[0].value, parseFloat(submitRow.children[3].children[0].value), fishType))
    scl[fishType].push(new Fish(submitRow.children[0].children[0].value, parseFloat(submitRow.children[3].children[0].value), fishType))
    if (parseFloat(submitRow.children[3].children[0].value) > largestBluegill && fishType == "bluegill") {
        submitRow.children[1].innerHTML = submitRow.children[3].children[0].value + "in"
    }
    if (parseFloat(submitRow.children[3].children[0].value) > largestBass && fishType == "bass") {
        submitRow.children[2].innerHTML = submitRow.children[3].children[0].value + "in"
    }
    calcStats()
}

function roundTo(num, to) {
    return to * ~~(num / to) // ~~ is floor
}

function capFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function calcStats() {
    let sizes = catches.map(fish => fish.size)
    let specificSizes = scl[fishType].map(fish => fish.size)
    let specificLargestInfo = scl[fishType].sort((a, b) => {return b.size - a.size})[0]
    $("#overallStats").html(`Mean: ${roundTo(mean(sizes), .001)}, Median: ${median(sizes)}`)
    $(`#${fishType}Stats`).html(`Mean: ${roundTo(mean(specificSizes), .001)}, Median: ${median(specificSizes)}`)
    $(`#largest${fishType}`).html(`Largest ${capFirstLetter(fishType)}: ${specificLargestInfo.catcher}'s ${specificLargestInfo.size}in`)
    $("#catchList").html(catches.map(fish => `${fish.catcher}'s ${fish.type}: ${fish.size}in, `))
}

class Fish {
    constructor(catcher, size, type) {
        this.catcher = catcher;
        this.size = size;
        this.type = type;
    }
}