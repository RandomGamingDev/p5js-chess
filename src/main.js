// https://www.chess.com/terms/fen-chess
//https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces

let screenSize = [400, 400];
let boardDim = [8, 8];
let boardBack;
let checkCol;
let selCheckCol;
let piecesImg;
let pieceRes = [320, 320];
let pieceSize = [screenSize[0] / boardDim[0], screenSize[1] / boardDim[1]];
let board;
let selected = false;
let selection = [0, 0];
let enPassantable = 0;
let enPassant = [0, 0];
let kings = [[4, 0], [4, 7]];
let castleable = [[true, true], [true, true]];
let whitesTurn = true;
let signs = [-1, 1];

function setup() {
  noStroke();
  createCanvas(screenSize[0], screenSize[1]);
  noSmooth();
  checkCol = [color(255, 206, 158, 255), color(209, 139, 71, 255)];
  selCheckCol = [color(241, 140, 130, 255), color(181, 96, 68, 255)];
  boardBack = new Pixy([0, 0], screenSize, boardDim);
  for (let i = 0; i < boardBack.res[0]; i++)
    for (let j = 0; j < boardBack.res[1]; j++)
      boardBack.setPixel([i, j], checkCol[(i + j) % 2]);
  boardBack.updatePixels();
  piecesImg = loadImage("assets/pieces.png");
  board = new Tilemap([0, 0], [screenSize[0], screenSize[1]], boardDim, piecesImg, []);
  for (let i = 0; i < 6; i++)
    for (let j = 0; j < 2; j++)
      board.tiles.push([i * pieceRes[0], j * pieceRes[1], pieceRes[0], pieceRes[1]]);
  board.tilemap = [
    [br, bp, em, em, em, em, wp, wr],
    [bn, bp, em, em, em, em, wp, wn],
    [bb, bp, em, em, em, em, wp, wb],
    [bq, bp, em, em, em, em, wp, wq],
    [bk, bp, em, em, em, em, wp, wk],
    [bb, bp, em, em, em, em, wp, wb],
    [bn, bp, em, em, em, em, wp, wn],
    [br, bp, em, em, em, em, wp, wr],
  ];
}

function draw() {
  boardBack.display();
  board.display();
}

function Undo(op, taken, wasEnPassantable, oldKingPos) {
  whitesTurn = !whitesTurn;
  kings[Number(whitesTurn)] = oldKingPos;
  board.tilemap[selection[0]][selection[1]] = board.tilemap[op[0]][op[1]];
  board.tilemap[taken[1][0]][taken[1][1]] = taken[0];
  if (wasEnPassantable)
    enPassantable++;
}

const GetMouseVec = () => [mouseX, mouseY];
const InBoard = (vec) => !(
    vec[0] < 0 || vec[0] >= boardDim[0] ||
    vec[1] < 0 || vec[1] >= boardDim[1]
  );
const GetPiece = (vec) => board.tilemap[vec[0]][vec[1]];
const SetPiece = (vec, value) => board.tilemap[vec[0]][vec[1]] = value;
const IsWhite = (piece) => piece % 2;
const IsLight = (vec) => (vec[0] + vec[1]) % 2;
const NumFlip = (num) => Number(!Boolean(num));

const InCheck = () => PieceInCheck(kings[Number(!whitesTurn)], whitesTurn);

function PieceInCheck(king, whitesTurn) {
  let horiDang = [[wq, wr], [bq, br]];
  
  let dif = king[0];
  
  for (let i = dif - 1; i >= 0; i--) {
    const piece = GetPiece([i, king[1]]);
    if (horiDang[Number(!whitesTurn)].includes(piece))
      return true;
    else if (piece != em)
      break; 
  }
  
  for (let i = dif + 1; i < boardDim[0]; i++) {
    const piece = GetPiece([i, king[1]]);
    if (horiDang[Number(!whitesTurn)].includes(piece))
      return true;
    else if (piece != em) 
      break;
  }
  
  dif = king[1];
  
  for (let i = dif - 1; i >= 0; i--) {
    const piece = GetPiece([king[0], i]);
    if (horiDang[Number(!whitesTurn)].includes(piece))
      return true;
    else if (piece != em)
      break;
  }
      
  for (let i = dif + 1; i < boardDim[1]; i++) {
    const piece = GetPiece([king[0], i]);
    if (horiDang[Number(!whitesTurn)].includes(piece))
      return true;
    else if (piece != em)
      break; 
  }
      
  let diagDang = [[wq, wb], [bq, bb]];
  
  dif = king[0] < king[1] ? king[0] : king[1];
  
  for (let i = 1; i < dif + 1; i++) {
    const piece = GetPiece(VecAdd(king, [-i, -i]));
    if (diagDang[Number(!whitesTurn)].includes(piece))
      return true;
    else if (piece != em)
       break;
  }
       
  dif = king[0] < boardDim[0] - king[1] ? king[0] : boardDim[0] - king[1];
       
  for (let i = 1; i < dif + 1; i++) {
    const piece = GetPiece(VecAdd(king, [-i, i]));
    if (diagDang[Number(!whitesTurn)].includes(piece))
      return true;
    else if (piece != em)
       break;
  }
  
  dif = boardDim[0] - king[0] < king[1] ? boardDim[0] - king[0] : king[1];
  
  for (let i = 1; i < dif; i++) {
    const piece = GetPiece(VecAdd(king, [i, -i]));
    if (diagDang[Number(!whitesTurn)].includes(piece))
      return true;
    else if (piece != em)
       break;
  }
  
  if (boardDim[0] - king[0] < boardDim[1] - king[1]) 
    dif = boardDim[0] - king[0];
  else
    dif = boardDim[1] - king[1];
       
  for (let i = 1; i < dif; i++) {
    const piece = GetPiece(VecAdd(king, [i, i]));
    if (diagDang[Number(!whitesTurn)].includes(piece))
      return true;
    else if (piece != em)
       break;  
  }
       
  let knights = [wn, bn];
  
  for (let i in signs)
    for (let j in signs) {
      let pos = VecAdd(king, [Number(signs[i] * 2), Number(signs[j])]);
      if (InBoard(pos) && GetPiece(pos) == knights[Number(!whitesTurn)])
        return true;
      
      pos = VecAdd(king, [Number(signs[i]), Number(signs[j] * 2)]);
      if (InBoard(pos) && GetPiece(pos) == knights[Number(!whitesTurn)])
        return true;
    }
  
  let pawns = [wp, bp];
  
  for (let i in signs) {
    let pos = VecAdd(king, [signs[i], signs[Number(whitesTurn)]]);
    if (InBoard(pos) && pawns[Number(!whitesTurn)] == GetPiece(pos))
      return true;
  }
  
  let kingTypes = [wk, bk];
  
  for (let i in signs)
    for (let j = -1; j < 2; j++) {
      let pos = VecAdd(king, [signs[i], j]);
      if (InBoard(pos) && GetPiece(pos) == kingTypes[Number(!whitesTurn)])
        return true; 
    }
        
  for (let i in signs) {
    let pos = VecAdd(king, [0, signs[i]]);
    if (InBoard(pos) && GetPiece(pos) == kingTypes[Number(!whitesTurn)])
      return true;
  }
  
  return false;
}

function mouseClicked() {
  let op = VecFloor(VecDiv(VecMul(GetMouseVec(), boardDim), screenSize));
  let piece = GetPiece(op);
  let pieceCol = IsWhite(piece);
  
  if(!InBoard(op))
    return;
    
  if (!selected) {
    if (piece == em)
      return;
    if (!(pieceCol ^ !whitesTurn))
      return;
    selection = op;
    boardBack.setPixel(selection, selCheckCol[IsLight(selection)]);
    boardBack.updatePixels();
    selected = true;
    return;
  }
  
  boardBack.setPixel(selection, checkCol[IsLight(selection)]);
  boardBack.updatePixels();
  selected = false;
  
  if (VecEqual(op, selection))
    return;
  if (piece != em && pieceCol == whitesTurn)
    return;
    
  piece = GetPiece(selection);
  pieceCol = IsWhite(piece);
  let taken = [em, [0, 0]];
  let kingPos = kings[Number(whitesTurn)];
  let oldKingPos = [...(kingPos)];
  let dif = VecSub(selection, op);
  let difAbs = VecAbs(dif);
  let dir = VecFlip(VecSign(dif));
  let castling = false;
  switch(piece) {
    case wk: // implement castling
    case bk:
      { 
        let difSign = Math.sign(dif[0]); // make it so that moving the king disables castling
        let difSignI = signs.indexOf(difSign);
        if (difAbs[0] == 2 &&
            difAbs[1] == 0 &&
            castleable[Number(whitesTurn)][difSignI] &&
            !PieceInCheck(selection, !whitesTurn) &&
            !PieceInCheck(VecAdd(selection, [-1 * difSign, 0]), !whitesTurn)) {
              for (let i = 1; i < Math.abs(signs.indexOf(Math.sign(op[0] - (boardDim[0] - 1) / 2)) * 7 - selection[0]); i++)
                if (GetPiece([selection[0] + Math.sign(op[0] - boardDim[0] / 2) * i, selection[1]]) != em)
                  return;
          castling = true
          break;
        }
            
            // check whether or not there's a piece inbetween and shift rook
        
        for (let i in op) {
          if (difAbs[i] > 1)
            return;
        }
        VecWrite(kingPos, op);
      }
      break;
    case wq:
    case bq:
      {
        if (VecMono(difAbs)) {
          for (let i = 1; i < difAbs[0]; i++)
            if (GetPiece(
                  VecAdd(selection, VecMul(MonoVec2(i), dir))
                ) != em)
              return;
          break;
        }
        
        let safe = false;
        for (let i in dif) {
          if (dif[NumFlip(Number(i))] != 0)
            continue;
          let selCop = [...selection];
          for (let j = 1; j < difAbs[i]; j++) {
            selCop[i] = selection[i] + j * dir[i];
            if (GetPiece(selCop) != em)
              return;
          }
          safe = true;
          break;
        }
        if (!safe)
          return;
      }
      break;
    case wb:
    case bb:
      {
        if (!VecMono(difAbs))
          return;
        for (let i = 1; i < difAbs[0]; i++)
          if (GetPiece(
                VecAdd(selection, VecMul(MonoVec2(i), dir))
              ) != em)
            return;
      }
      break;
    case wn:
    case bn:
      {
        if (VecEqual(difAbs, [1, 2]))
          break;
        if (VecEqual(difAbs, [2, 1]))
          break;
        return;
      }
      break;
    case wr:
    case br: // check whether it's in corner and set to true or false based on that
      {
        let safe = false;
        for (let i in dif) {
          if (dif[NumFlip(Number(i))] != 0)
            continue;
          let selCop = [...selection];
          for (let j = 1; j < difAbs[i]; j++) {
            selCop[i] = selection[i] + j * dir[i];
            if (GetPiece(selCop) != em)
              return;
          }
          safe = true;
          break;
        }
        if (!safe)
          return;
      }
      break;
    case wp:
    case bp:
      {
        if (Math.sign(dif[1]) == signs[Number(!whitesTurn)])
          return;
          
        if (difAbs[0] != 0) {
          for (let i in difAbs)
            if (difAbs[i] != 1)
              return;
            
          if (GetPiece(op) != em)
            break;
            
          if (enPassantable != 0 && 
              VecEqual(enPassant, 
                VecSub(op, [0, signs[Number(!whitesTurn)]]))) {
            taken = [GetPiece(enPassant), enPassant];
            SetPiece(enPassant, em);
            break; 
          }
            
          return;
        }
        
        if (difAbs[1] > 2)
          return;
        let jump = difAbs[1] == 2;
        
        let jumpRows = [1, 6];
        if (jump && selection[1] != jumpRows[Number(whitesTurn)])
          return;
        
        for (let i = 1; i < difAbs[1] + 1; i++)
          if (GetPiece([selection[0], selection[1] + i * dir[1]]) != em)
            return;
            
        if (!jump) 
          break;
          
        enPassantable = 2;
        enPassant = op;
      }
      break;
  }
    
  if (taken[0] == em) {
    taken[0] = board.tilemap[op[0]][op[1]];
    taken[1] = op;
  }
  SetPiece(op, GetPiece(selection));
  SetPiece(selection, em);
  
  let wasEnPassantable = false;
  if (enPassantable > 0) {
    enPassantable--; 
    wasEnPassantable = true;
  }
  whitesTurn = !whitesTurn;
  
  let inCheck = InCheck();
  
  if (inCheck)
    Undo(op, taken, wasEnPassantable, oldKingPos);
  else {
    switch (piece) {
      case wp:
      case bp:
        let promoteRows = [7, 0];
        if (op[1] == promoteRows[Number(!whitesTurn)])
          SetPiece(op, piece - 8);
        break;
      case wr:
      case br:
        let backRanks = [0, 7];
        let xCorners = [7, 0];
        let xCorner = xCorners.indexOf(selection[0]);
        
        if (selection[1] == backRanks[Number(!whitesTurn)] &&
            xCorner != -1)
              castleable[Number(!whitesTurn)][xCorner] = false;
        break;
      case wk:
      case bk:
        for (let i in castleable[Number(!whitesTurn)])
          castleable[Number(!whitesTurn)][i] = false;
        if (!castling)
          break;
        SetPiece([op[0] + -1 * Math.sign(op[0] - (boardDim[0] - 1) / 2), op[1]], wr + Number(whitesTurn))
        SetPiece([signs.indexOf(Math.sign(op[0] - (boardDim[0] - 1) / 2)) * 7, op[1]], em);
        break;
    }
  }
}