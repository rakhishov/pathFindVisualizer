/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
export function bfs(board, start, goal){
    var visited = [];
    var queue = [start];
    console.log("start")
    while(queue){
        var curNode = queue.shift();
        console.log("do curnode == goal")
        if(curNode === goal){
            return visited;
        }
        
        if(!curNode.isWall && (!curNode.isVisited||curNode.isStart)){
            curNode.isVisited = true;
            visited.push(curNode);
            const col = curNode.col;
            const row = curNode.row;
            
            
            var nextNode;

            if(row>0){
                nextNode = board[row-1][col];
                if(!nextNode.isVisited){
                    queue.push(nextNode);
                    nextNode.parent = curNode;
                }
            }
            if(col>0){
                nextNode = board[row][col-1];
                if(!nextNode.isVisited){
                    queue.push(nextNode);
                    nextNode.parent = curNode;
                }
            }
            if(row<board.length-1){
                nextNode = board[row+1][col];
                if(!nextNode.isVisited){
                    queue.push(nextNode);
                    nextNode.parent = curNode;
                }
            }
            if(col<board[0].length-1){
                nextNode = board[row][col+1];
                if(!nextNode.isVisited){
                    queue.push(nextNode);
                    nextNode.parent = curNode;
                }
            }

        }
        
    }
}