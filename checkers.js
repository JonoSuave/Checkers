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


$(document).ready(function(){
    createCheckerSquares();
    var turn = "black";
    var firstActive = false;

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
        }else if(firstActive) {
            
            if (canSlideHere(id, enemyColor)) {
                slide(id);
                firstActive = false;
                endTurn();
            } else if(canCheckerJump($("#" + id), generatePossibilities(id), enemyColor)) {
                jumpEnemy(id, enemyColor);
                firstActive = false;
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
    
    function canJumpAgain(clickedId, enemyColor) {
        var elementClicked = $("#" + clickedId);
        var leftId = turn === 'black' ? twoCharacterId(+clickedId + 22) : twoCharacterId(+clickedId - 18);
        var rightId = turn === 'black' ? twoCharacterId(+clickedId + 18) : twoCharacterId(+clickedId - 22);
        if(canJumpTo(leftId, enemyColor)) {
            return true;
        }else if(canJumpTo(rightId, enemyColor)) {
            return true;
        }
        //if canJumpTo leftId or rightId return true
        
    }
    
    function isPossibleSquareOnBoard(targetId) {
        return targetId.charAt(0) >= 0 && targetId.charAt(0) < 8 && targetId.charAt(1) < 8;
    }
    
    function isEnemyPiece(targetId, enemyColor) {
        return $('#' + targetId).hasClass(enemyColor + "-checker-img");            
    }
    
    function wouldJumpEnemy(clickedId, targetId, enemyColor) {
        var inBetween = (parseInt(clickedId + targetId)/2).toString();
        return isEnemyPiece(inBetween, enemyColor);
        
    }
    
    function isBlankSquare(targetId, enemyColor) {
        return !$('#' + targetId).hasClass(turn + "-checker-img") && !$('#' + targetId).hasClass(enemyColor + "-checker-img");
    }
//    function canJumpTo(targetId,originId)     
    function canJumpTo(targetId, enemyColor){
        return isValidSquare(targetId, enemyColor) && wouldJumpEnemy(targetId, enemyColor);
        //return true if isValidSquare and has an inbetween enemy
    }
    
    function isValidSquare(targetId, enemyColor){
        return (isBlankSquare(targetId, enemyColor) && isPossibleSquareOnBoard(targetId)); 
    }
    
    function twoCharacterId(id) {
        if(typeof id === 'number') id = id.toString();
        if(id.length === 1){
            id = '0' + id;
        }
        return id;
    }
    
    function slide(elId) {
        var cell = $("#" + elId);
        $(cell).addClass(turn + "-checker-img"); $('#container').find('.highlight').removeClass(turn + '-checker-img highlight');
    }
    
    function jumpEnemy(elId, enemyColor) {
        var cell = $("#" + elId);
        var hightlight = $('#container').find('.highlight').attr('id');
        var between = parseInt((+elId + +hightlight)/2).toString();
        $(cell).addClass(turn + "-checker-img");
        $('#'+between).removeClass(enemyColor + "-checker-img");
        $('#container').find('.highlight').removeClass(turn + '-checker-img highlight');
    }

    function canSlideHere(elId, enemyColor) {
        var cell = $("#" + elId);
        var possibilities = generatePossibilities(elId);
        return !$(cell).hasClass(turn + "-checker-img") &&
                ($("#"+possibilities[turn].slideLeft).hasClass("highlight") === true || $("#"+possibilities[turn].slideRight).hasClass("highlight"));
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
    
//    function validMove(elId, cellEl, enemyColor){
//        var possibilities = generatePossibilities(elId);
//        return validation(cellEl, possibilities, enemyColor);
//    }
//        
//    function validation(clickedCell, objPoss, enemyColor) {
//        if($(clickedCell).hasClass(turn + "-checker-img") != true &&
//            $("#"+objPoss[turn].slideLeft).hasClass("highlight") === true || $("#"+objPoss[turn].slideRight).hasClass("highlight")){
//            return "slide";
//        }else if(canCheckerJump(clickedCell, objPoss, enemyColor)) {
//            return enemyColor;         
//        }
//        return false;
//    }
    
    function canCheckerJump(clickedCell, objPoss, enemyColor) {
        return canCheckerJumpHere(clickedCell,objPoss,enemyColor,'Right') || canCheckerJumpHere(clickedCell,objPoss,enemyColor,'Left');
    }
    
    function canCheckerJumpHere(clickedCell,objPoss,enemyColor,dir) {
        return $(clickedCell).hasClass(turn + "-checker-img") != true && $("#"+objPoss[turn]['jump' + dir]).hasClass("highlight") === true && $("#"+objPoss[turn]['slide' + dir]).hasClass(enemyColor + "-checker-img") === true;
    }
    
    function endTurn() {
        if(turn === "black") {
            turn = "red";
        }else if(turn === "red") {
            turn = "black"; 
        }
        return turn
    }
});