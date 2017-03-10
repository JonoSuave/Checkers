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

function detectMoves(id,cell){
    var eleven = "11";
    var idNum11 = parseInt(id+eleven);
    var possibleCell11 = idNum11.toString();
    
    if($('#'+possibleCell11).hasClass("black-checker-img") != true){
        if(firstActive === true){
            
        }
//        Can move if empty square is clicked on. Idea: When a cell is clicked, see if another cell has been activated already (with a flag). If yes, then move the image to cell and delete it from the other cell.
        
    } 
}



$(document).ready(function(){
    createCheckerSquares();
    var blackTurn = true;
    var redTurn = false;
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
        }else if(firstActive === true) {
            canCheckerMoveHere(id);
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
        var possibleNine = negativeNine.toString()
        var possibilities = {
            negEleven: negativeEleven,
            possEleven: possibleEleven,
            negNine: negativeEleven,
            possNine: possibleNine
        }
        if($(cellEl).hasClass("black-checker-img") != true && $("#"+possibilities.possEleven).hasClass("highlight") === true || $("#"+possibilities.possNine).hasClass("highlight")){
            return true;
        }else if($(cellEl).hasClass("black-checker-img") === true) {
            return false;
        }else if($(cellEl).hasClass("black-checker-img") != true && ($("#"+possibilities.possEleven).hasClass("highlight") != true && $("#"+possibilities.possEleven).hasClass("red-checker-img") || $("#"+possibilities.possNine).hasClass("highlight") != true && $("#"+possibilities.possEleven).hasClass("red-checker-img") != true)) {
            return false;
        }
//        if(possibilities.possEleven)
    }
});