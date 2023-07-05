function Distance(i, j) {
  return Math.sqrt(i ** 2 + j ** 2)
}

function MonoVec2(num) {
  return [num, num];
}

function VecAdd(vec1, vec2) {
  let toReturn = [...vec1];
  for (let i in vec2)
    toReturn[i] += vec2[i];
  return toReturn;
}

function VecSub(vec1, vec2) {
  let toReturn = [...vec1];
  for (let i in vec2)
    toReturn[i] -= vec2[i];
  return toReturn;
}


function VecMul(vec1, vec2) {
  let toReturn = [...vec1];
  for (let i in vec2)
    toReturn[i] *= vec2[i];
  return toReturn;
}

function VecDiv(vec1, vec2) {
  let toReturn = [...vec1];
  for (let i in vec2)
    toReturn[i] /= vec2[i];
  return toReturn;
}

function VecSum(vecs) {
  let toReturn = [...vecs[0]];
  for (let i = 1; i < vecs.length; i++)
    for (let j in vecs[i])
      toReturn[j] += vecs[i][j];
  return toReturn;
}

function VecFlip(vec) {
  let toReturn = [...vec];
  for (let i in toReturn)
    toReturn[i] *= -1;
  return toReturn;
}

function VecAbs(vec) {
  let toReturn = [...vec];
  for (let i in toReturn)
    toReturn[i] = Math.abs(toReturn[i]);
  return toReturn;
}

function VecRound(vec) {
  let toReturn = [...vec];
  for (let i in toReturn)
    toReturn[i] = Math.round(toReturn[i]);
  return toReturn;
}

function VecCeil(vec) {
  let toReturn = [...vec];
  for (let i in toReturn)
    toReturn[i] = Math.ceil(toReturn[i]);
  return toReturn;
}

function VecFloor(vec) {
  let toReturn = [...vec];
  for (let i in toReturn)
    toReturn[i] = Math.floor(toReturn[i]);
  return toReturn;
}

function VecDist(vec1, vec2) {
  let axisDist = VecSub(vec1, vec2);
  return Distance(axisDist[0], axisDist[1]);
}

function VecEqual(vec1, vec2) {
  for (let i in vec1)
    if (vec1[i] != vec2[i])
      return false;
  return true;
}

function VecWrite(vecTo, vecFrom) {
  for (let i in vecTo)
    vecTo[i] = vecFrom[i];
}

function VecMono(vec) {
  let mono = vec[0];
  for (let i = 1; i < vec.length; i++)
    if (vec[i] != mono)
      return false;
  return true;
}

function VecSign(vec) {
  let toReturn = [...vec];
  for (let i in toReturn)
    if (toReturn[i] > 0)
      toReturn[i] = 1;
    else if (toReturn[i] < 0)
      toReturn[i] = -1;
    else
      toReturn[i] = 0;
  return toReturn;
}

function Vec2Swap(vec) {
  return [vec[1], vec[0]];
}