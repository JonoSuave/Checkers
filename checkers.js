var boardState = [
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8),
    new Array(8)
]

function createCheckerSquares() {
    
    for(var i = 0; i<8;i++){
        var divRow = $("<div></div>");
        for(var j = 0; j<8;j++){
            if((i+j)%2 === 0){
                var divRowBlock = $("<div></div>");
                $(divRow).append(divRowBlock);
                makeBlackSquare(divRowBlock,i,j);
                makeCheckerImg(i,divRowBlock);
                boardState[i][j] = pieceBuilder(i);
            }else if((i+j)%2 === 1){
                var divRowBlock = $("<div></div>");
                $(divRow).append(divRowBlock);
                makeRedSquare(divRowBlock);
            }else{
                alert("Something is up");
            }    
        }
        $('#container').append(divRow)
    }
    console.log(boardState);
    
}

function pieceBuilder(i){
    var piece = {
        king: false
    };
    if (i<3){
        piece.color = 'black';
    }else if(i>4){
        piece.color = 'red';
    }
    return piece;
}

function makeCheckerImg(i,woo){
    if(i<3){
        var blackCheckerImg = $(woo).addClass('black-checker-img');
//            $("<img />").attr("src","images/black.png");
//        $(blackCheckerImg).addClass('img-size');
//       $(woo).append(blackCheckerImg); 
        
        
    }else if (i>4){
        var redCheckerImg = $(woo).addClass('red-checker-img'); 
    }
}

function makeBlackSquare(el,i,j) {
    el.addClass('black');
    el.addClass('cell');
    var id = ""+i+j;
    $(el).attr("id",id);
}

function makeRedSquare(el) {
    el.addClass('red');
    el.addClass('cell');
}

function getCoordinates(id){
    var coord =  {
        row: id.charAt(0),
        col: id.charAt(1)
    }
    return coord;
}

function detectChecker(id) {
    var cell = $("#"+id);
    if($(cell).hasClass("black-checker-img") === true){
       detectMoves(id,cell);
    }
    
}


$(document).ready(function(){
    createCheckerSquares();
    var blackTurn = true;
    var redTurn = false;
    var turn = "black"    
    var firstActive = false;

    $('.cell').click(function(){
        var id= $(this).attr('id');
        activeCell(id);
//        var coordinates = getCoordinates(id);
//        detectChecker(id);
    });
//    Helper functions
    function activeCell(id) {
        if(firstActive === false) {
            firstActive = true;
            $("#"+id).addClass('highlight');
        }else if(firstActive === true && turn === "black" && canCheckerMoveHere(id)) {
            firstActive = false;
            colorTurn();
        }else if(firstActive === true && turn === "red" && canCheckerMoveHere(id)) {
            firstActive = false;
            colorTurn();
        }else if(firstActive) {
            $('#container').find('.highlight').removeClass('highlight');
            firstActive = false;
            //what to do if they can't move
        }
        return firstActive;
    }

    function canCheckerMoveHere(elId){
        var cell = $("#"+elId);
        var valid = validMove(elId, cell);
        if(valid === true){
            $(cell).addClass("black-checker-img"); $('#container').find('.highlight').removeClass('black-checker-img highlight');
        }else if(valid === false){
            alert("No can do-ey mate");
        }

    }
    
    function validMove(elId, cellEl){
        var negativeEleven = parseInt(elId - 11);
        var possibleEleven = negativeEleven.toString();
        var negativeNine = parseInt(elId - 9);
        var possibleNine = negativeNine.toString();
        var positiveEleven = parseInt(elId + 11);
        var redEleven = positiveEleven.toString();
        var positiveNine = parseInt(elId + 9);
        var redNine = positiveNine.toString();
        var possibilities = {
            negEleven: negativeEleven,
            possEleven: possibleEleven,
            negNine: negativeEleven,
            possNine: possibleNine,
            redEleven: redEleven,
            redNine: redNine
        }
        if(turn === "black") {
            return blackValidation(cellEl, possibilities); 
        }else if(turn === "red"){
            return redValidation(cellEl, possibilities);
        }
    }
    
    function blackValidation(clickedCell, objPoss) {
        if($(clickedCell).hasClass("black-checker-img") != true && $("#"+objPoss.possEleven).hasClass("highlight") === true || $("#"+objPoss.possNine).hasClass("highlight")){
            return true;
        }else if($(clickedCell).hasClass("black-checker-img") === true) {
            return false;
        }else if($(clickedCell).hasClass("black-checker-img") != true && ($("#"+objPoss.possEleven).hasClass("highlight") != true && $("#"+objPoss.possEleven).hasClass("red-checker-img") || $("#"+objPoss.possNine).hasClass("highlight") != true && $("#"+objPoss.possEleven).hasClass("red-checker-img") != true)) {
            return false;
        }
    }
    
    function redValidation(cellClicked, possObj) {
        if($(cellClicked).hasClass("red-checker-img") != true && $("#" + possObj.redEleven).hasClass("highlight") === true || $("#" + possObj.redNine).hasClass("highlight")) {
            return true;
        } else if($(cellClicked).hasClass("red-checker-img") === true) {
            return false;
        } else if($(cellClicked).hasClass("red-checker-img") != true && ($("#" + possObj.redEleven).hasClass("red-checker-img") || $("#" + possObj.redNine).hasClass("red-checker-img") != true && $("#" + possObj.redEleven).hasClass("red-checker-img") != true)) {
            return false;
        }
    }
    
    function colorTurn() {
        if(turn === "black") {
            turn = "red";
        }else if(turn === "red") {
            turn = "black"; 
        }
        return turn
    }
});