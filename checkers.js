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
//        king: false
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


$(document).ready(function(){
    createCheckerSquares();
    var turn = "black";
    var firstActive = false;
    var kingPieceActive = false;
    var highlightedCellId; 
    var keepCheckerHighlighted = false;

    $('.cell').click(function(){
        var id = $(this).attr('id');
        var enemyColor = turn === 'black' ? 'red' : 'black';
        activateCell(id, enemyColor);
//        var coordinates = getCoordinates(id);
    });
//    Helper functions
    function activateCell(id, enemyColor) {
        if(!firstActive) {
            firstActive = true;
            $("#"+id).addClass('highlight');
            highlightedCellId = $("#" + id).attr('id');
            if ($("#" + id).hasClass('king')) {
                kingPieceActive = true;
            }
        } else if(firstActive) {
            
            if (canSlideHere(id, enemyColor)) {
                slide(id);
                firstActive = false;
                makeCheckerKing(id);
                endTurn();
            } else if(canCheckerJump($("#" + id), generatePossibilities(id), enemyColor)) {
                jumpEnemy(id, enemyColor);
                firstActive = false;
                makeCheckerKing(id);
                kingPieceActiveCheck(id);
                if(!canJumpAgain(id, enemyColor)){
                    endTurn();
                }
                keepCheckerHighlighted = true;
            }
            else {  
                alert("No can do-ey mate");               $('#container').find('.highlight').removeClass('highlight');
                firstActive = false;
                kingPieceActive = false;
                //what to do if they can't move
            }
        }
        if (keepCheckerHighlighted = false) {
            return firstActive;
        }
    }
    
    function slide(elId) {
        var cell = $("#" + elId);
        if (kingPieceActive) {
            $(cell).addClass(turn + "-checker-img king");
        } else {
            $(cell).addClass(turn + "-checker-img");
        }
        $('#container').find('.highlight').removeClass(turn + '-checker-img highlight king');
    }
    
    function canJumpAgain(clickedId, enemyColor) {
        var elementClicked = $("#" + clickedId);
        var checkerMovements = {
            black: {
                right: twoCharacterId(+clickedId + 18),
                left: twoCharacterId(+clickedId + 22)
            },
            red: {
                right: twoCharacterId(+clickedId - 22),
                left: twoCharacterId(+clickedId - 18)
            }
        };
        var leftId = turn === 'black' ? checkerMovements.black.left : checkerMovements.red.left;
        var rightId = turn === 'black' ? checkerMovements.black.right : checkerMovements.red.right;
        // if king, do the same as above as well, but with opposite direction's math
        if(kingPieceActive) {
            return canJumpTo(checkerMovements.black.left, clickedId, enemyColor) || canJumpTo(checkerMovements.red.left, clickedId, enemyColor) || canJumpTo(checkerMovements.black.right, clickedId, enemyColor) || canJumpTo(checkerMovements.red.right, clickedId, enemyColor)
        }else {
            return canJumpTo(leftId, clickedId, enemyColor) || canJumpTo(rightId, clickedId, enemyColor);
        }

    }
       
    function canJumpTo(targetId, clickedId, enemyColor){
        return isValidSquare(targetId, enemyColor) && wouldJumpEnemy(targetId, clickedId, enemyColor);
        //return true if isValidSquare and has an inbetween enemy
    }
    
    function isValidSquare(targetId, enemyColor){
        return (isBlankSquare($('#' + targetId), enemyColor) && isPossibleSquareOnBoard(targetId)); 
    }
    
    function isBlankSquare(targetId) {
        return !targetId.hasClass("red-checker-img") && !targetId.hasClass("black-checker-img");
    }
    
    function isPossibleSquareOnBoard(targetId) {
        return targetId.charAt(0) >= 0 && targetId.charAt(0) < 8 && targetId.charAt(1) < 8;
    }
    
    function isEnemyPiece(targetId, enemyColor) {
        return $('#' + targetId).hasClass(enemyColor + "-checker-img");            
    }

    function wouldJumpEnemy(targetId, clickedId, enemyColor) {
        var inBetween = (parseInt(+clickedId + (+targetId))/2).toString();
        return isEnemyPiece(inBetween, enemyColor);

    }
    
    function twoCharacterId(id) {
        if(typeof id === 'number') id = id.toString();
        if(id.length === 1){
            id = '0' + id;
        }
        return id;
    }
    
    function makeCheckerKing(id) {
        var num = +id;
        if(num < 8 || num >= 70) {
            $("#" + id).addClass("king");
        }
    }
    
    function kingPieceActiveCheck(id) {
        if ($("#" + id).hasClass('king')) {
            kingPieceActive = true;
        }
    }
    
    function jumpEnemy(elId, enemyColor) {
        var cell = $("#" + elId);
        var hightlight = $('#container').find('.highlight').attr('id');
        var between = parseInt((+elId + +hightlight)/2).toString();
        if (kingPieceActive) {
            $(cell).addClass(turn + "-checker-img king");
            $('#'+between).removeClass(enemyColor + "-checker-img");
            $('#container').find('.highlight').removeClass(turn + '-checker-img highlight king');
        }
        $(cell).addClass(turn + "-checker-img");
        $('#'+between).removeClass(enemyColor + "-checker-img");
        $('#container').find('.highlight').removeClass(turn + '-checker-img highlight king');
    }

    function canSlideHere(elId, enemyColor) {
        var cell = $("#" + elId);
        var possibilities = generatePossibilities(elId);
        return isValidSquare(elId) && isValidSlide(elId,possibilities,enemyColor, cell);
    }
    
    function isValidSlide(id,possibilities, enemyColor, cell){
        var validMoves = {
            black: {
                left:$("#"+possibilities.black.slideLeft).is("." + turn + "-checker-img.highlight"),
                right:$("#"+possibilities.black.slideRight).is("." + turn + "-checker-img.highlight")
            },
            red:{
                left:$("#"+possibilities.red.slideLeft).is("." + turn + "-checker-img.highlight"),
                right:$("#"+possibilities.red.slideRight).is("." + turn + "-checker-img.highlight")
            }
        };
        if(kingPieceActive){
            return (validMoves.black.left || validMoves.black.right || validMoves.red.left || validMoves.red.right); 
        }
        else{
            return (validMoves[turn].left || validMoves[turn].right) && (!$(cell).hasClass("black-checker-img") || !$(cell).hasClass("red-checker-img"));
        }
    }
    
    function generatePossibilities(id) {
        return {
            black: {
                slideLeft: twoCharacterId((+id - 11).toString()),
                slideRight: twoCharacterId((+id - 9).toString()),
                jumpRight: twoCharacterId((+id - 18).toString()),
                jumpLeft: twoCharacterId((+id - 22).toString())
            },
            red: {
                slideRight: twoCharacterId((+id + 11).toString()),
                slideLeft: twoCharacterId((+id + 9).toString()),
                jumpLeft: twoCharacterId((+id + 18).toString()),
                jumpRight: twoCharacterId((+id + 22).toString())
            }
        };
    }
    function canCheckerJump(clickedCell, objPoss, enemyColor) {
        return canCheckerJumpHere(clickedCell,objPoss,enemyColor,'Right') || canCheckerJumpHere(clickedCell,objPoss,enemyColor,'Left');
    }
    
    function canCheckerJumpHere(clickedCell,objPoss,enemyColor,dir) {
        var clickedCellId = $(clickedCell).attr('id');
        if (kingPieceActive){
            return !$(clickedCell).hasClass(turn + "-checker-img") && ($("#"+objPoss[turn]['jump' + dir]).hasClass("highlight") || $("#"+objPoss[enemyColor]['jump' + dir]).hasClass("highlight")) && (wouldJumpEnemy(highlightedCellId, clickedCellId, enemyColor) || wouldJumpEnemy(highlightedCellId, clickedCellId, enemyColor));
        } else {
            return isBlankSquare(clickedCell) && $("#"+objPoss[turn]['jump' + dir]).hasClass("highlight") && $("#"+objPoss[turn]['slide' + dir]).hasClass(enemyColor + "-checker-img")
        }    
    }
    
//    function checkCanCheckerJumpHereEnemyPiece(objPoss, enemyColor, dir) {
//        $("#"+objPoss[turn]['slide' + dir]).hasClass(enemyColor + "-checker-img") && $("#" + ) || $("#"+objPoss[enemyColor]['slide' + dir]).hasClass(enemyColor + "-checker-img")
//    }
    
    function endTurn() {
        kingPieceActive = false;
        if(turn === "black") {
            turn = "red";
        }else if(turn === "red") {
            turn = "black"; 
        }
        keepCheckerHighlighted = false;
        return turn
    }
});