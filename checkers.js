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
//        Can move if empty square is clicked on
        
    } 
}


$(document).ready(function(){
    createCheckerSquares();
    var blackTurn = true;
    var redTurn = false;

    $('.cell').click(function(){
        var id= $(this).attr('id');
        var coordinates = getCoordinates(id);
        detectChecker(id);
    });
});