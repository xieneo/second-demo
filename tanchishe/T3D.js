function changeTo3D(){
    document.body.style.perspective = '800px';
    chessBoard.style.transform = 'rotateX(45deg)';
    chessBoard.classList.add('T3D');
}