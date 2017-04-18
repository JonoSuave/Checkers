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


$(document).ready(function(){
    createCheckerSquares();
    var turn = "black";
    var firstActive = false;
    var kingPieceActive = false;

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
            }
            else {  
                alert("No can do-ey mate");               $('#container').find('.highlight').removeClass('highlight');
                firstActive = false;
                //what to do if they can't move
            }
        }
        return firstActive;
    }
    
    function slide(elId) {
        var cell = $("#" + elId);
        if (kingPieceActive) {
            $(cell).addClass(turn + "-checker-img king");
        } else {
            $(cell).addClass(turn + "-checker-img");
        }
        $('#container').find('.highlight').removeClass(turn + '-checker-img highlight');
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
//        var possibilities = generatePossibilities(clickedId);
//        if(canJumpTo(possibilities[enemyColor]['jumpRight'], clickedId, enemyColor) || canJumpTo(possibilities[enemyColor]['jumpLeft'], clickedId, enemyColor)) {
//            return true;
//        }else if (kingPieceActive) {
//            return canJumpTo(possibilities[enemyColor]['jumpRight'], clickedId, enemyColor) || canJumpTo(possibilities[enemyColor]['jumpLeft'], clickedId, enemyColor) || canJumpTo(possibilities[turn]['jumpRight'], clickedId, enemyColor) || canJumpTo(possibilities[turn]['jumpLeft'], clickedId, enemyColor)
//        }
        //if canJumpTo leftId or rightId return true
        
    }
       
    function canJumpTo(targetId, clickedId, enemyColor){
        return isValidSquare(targetId, enemyColor) && wouldJumpEnemy(targetId, clickedId, enemyColor);
        //return true if isValidSquare and has an inbetween enemy
    }
    
    function isValidSquare(targetId, enemyColor){
        return (isBlankSquare(targetId, enemyColor) && isPossibleSquareOnBoard(targetId)); 
    }
    
    function isBlankSquare(targetId) {
        return !$('#' + targetId).hasClass("red-checker-img") && !$('#' + targetId).hasClass("black-checker-img");
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
            $(cell).addClass(turn + "-checker-img king")
        }
        $(cell).addClass(turn + "-checker-img");
        $('#'+between).removeClass(enemyColor + "-checker-img");
        $('#container').find('.highlight').removeClass(turn + '-checker-img highlight king');
    }

    function canSlideHere(elId, enemyColor) {
        var cell = $("#" + elId);
        var possibilities = generatePossibilities(elId);
//        return (!$(cell).hasClass(turn + "-checker-img") &&
//                ($("#"+possibilities[turn].slideLeft).hasClass(turn + "-checker-img highlight") || $("#"+possibilities[turn].slideRight).hasClass(turn + "-checker-img highlight"))) || (kingPieceActive && ($("#"+possibilities[enemyColor].slideLeft).hasClass(turn + "-checker-img highlight") || $("#"+possibilities[enemyColor].slideRight).hasClass(turn + "-checker-img highlight")));
        return isValidSquare(elId) && isValidSlide(elId,possibilities,enemyColor);
    }
    
    function isValidSlide(id,possibilities, enemyColor){
        var validMoves = {
            black: {
                left:$("#"+possibilities.black.slideLeft).hasClass("black-checker-img highlight"),
                right:$("#"+possibilities.black.slideRight).hasClass("black-checker-img highlight")
            },
            red:{
                left:$("#"+possibilities.red.slideLeft).hasClass("red-checker-img highlight"),
                right:$("#"+possibilities.red.slideRight).hasClass("red-checker-img highlight")
            }
        };
        if(kingPieceActive){
            return (validMoves.black.left || validMoves.black.right || validMoves.red.left || validMoves.red.right); 
        }
        else{
            return (validMoves[turn].left || validMoves[turn].right);
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
        if (kingPieceActive){
            return !$(clickedCell).hasClass(turn + "-checker-img") && ($("#"+objPoss[turn]['jump' + dir]).hasClass("highlight") || $("#"+objPoss[enemyColor]['jump' + dir]).hasClass("highlight")) && ($("#"+objPoss[turn]['slide' + dir]).hasClass(enemyColor + "-checker-img") || $("#"+objPoss[enemyColor]['slide' + dir]).hasClass(enemyColor + "-checker-img"));
        } else {
            return !$(clickedCell).hasClass(turn + "-checker-img") && $("#"+objPoss[turn]['jump' + dir]).hasClass("highlight") && $("#"+objPoss[turn]['slide' + dir]).hasClass(enemyColor + "-checker-img")
        }
        
    }
    
    function endTurn() {
        kingPieceActive = false;
        if(turn === "black") {
            turn = "red";
        }else if(turn === "red") {
            turn = "black"; 
        }
        return turn
    }
});