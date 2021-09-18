import React, {Component} from "react";
import {bfs} from "../algorithm/bfs"
import Node from "./node/Node"
import "./PathFind.css"
import { Button } from "react-bootstrap";

const numOfRows = 20;
const numOfColumns = 40;

export default class PathFind extends Component{
    constructor(){
        super();
        this.state = {
            board: [],
            STARTNODE_ROW: 5,
            STARTNODE_COL: 5,
            GOALNODE_ROW: 14,
            GOALNODE_COL: 15,
            mouseIsPressed: false,
            isRunning: false
        }
    }
    componentDidMount(){
        this.setState({board: this.getInitBoard()});
    }
    handleMouseDown(row, col){
        const{board} = this.state;
        const newBoard = wallGenerate(board, row, col);
        this.setState({board: newBoard, mouseIsPressed: true});
    }

    handleMouseUp(){
        this.setState({mouseIsPressed: false});
    }

    handleMouseEnter(row, col){
        if(this.state.mouseIsPressed){
            const newBoard = wallGenerate(this.state.board, row, col);
            this.setState({board: newBoard});
        }
    }

    newNode(row, col){
        return {
            row,
            col,
            isStart: row === this.state.STARTNODE_ROW && col===this.state.STARTNODE_COL,
            isGoal: row === this.state.GOALNODE_ROW && col===this.state.GOALNODE_COL,
            isWall: false,
            isVisited: false,
            parent: null
        }
    }

    getInitBoard(){
        const board = [];
        for(let i = 0; i<numOfRows; i++){
            const currRow = [];
            for(let j = 0; j<numOfColumns; j++){
                var node = this.newNode(i, j);
                currRow.push(node);
            }
            board.push(currRow);
        }
        return board;
    }



    bfsearch(){
        var{board} = this.state;
        var start = board[this.state.STARTNODE_ROW][this.state.STARTNODE_COL];
        var goal = board[this.state.GOALNODE_ROW][this.state.GOALNODE_COL];
        var visited = bfs(board, start, goal);
        console.log(visited);
        var way = shortWay(goal);
        console.log(way);
        this.visualiseBfs(visited, way);
        console.log(board);
    }
    
    
    
    visualiseBfs(visited, path){
        for(var i = 0; i<=visited.length; i++){
            if(i===visited.length){
                setTimeout(()=>{
                    this.animatePath(path)
                }, 10*i);
                return;
            }
            const node = visited[i];
            setTimeout(()=>{
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }, 10*i)
        }
    }
    
    
    
    
    animatePath(path){
        for(var i = 0; i<path.length; i++){
            const node = path[i];
            setTimeout(()=>{
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-path';
            }, 50*i);
        }
    }
    changeTheme(){
        if(document.body.classList.length===0){
            document.body.classList.add("App-black");
        }
        else{
            document.body.classList.remove("App-black");
        }
    }
    render() {
        const{board, mouseIsPressed} = this.state;
        return (
          <>
            <div className="grid">
                
              {board.map((row, rowIdx) => {
                return (
                  <div key={rowIdx}>
                    {row.map((node, nodeIdx) => {
                      const row = node.row;
                      const col = node.col;
                      const isGoal = node.isGoal;
                      const isStart = node.isStart;
                      const isWall = node.isWall;
                      return (
                        <Node
                          key={nodeIdx}
                          col={col}
                          isGoal={isGoal}
                          isStart={isStart}
                          isWall={isWall}
                          mouseIsPressed={mouseIsPressed}
                          onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                          onMouseEnter={(row, col) =>
                            this.handleMouseEnter(row, col)
                          }
                          onMouseUp={() => this.handleMouseUp()}
                          row={row}></Node>
                      );
                    })}
                    
                  </div>
                  
                );
              })}
            <Button variant="outline-primary" onClick={() => this.bfsearch()}>BFS</Button>
            <Button variant="outline-primary" onClick={() => this.changeTheme()}>Dark Mode</Button>
            </div>
          </>
        );
      }
    }

const wallGenerate = (board, row, col)=>{
    const newBoard = board.slice();
    console.log(row + " " + col);
    const node = newBoard[row][col];
    if(!node.isStart && !node.isGoal){
        const newNode = {
            ...node,
            isWall: !node.isWall,
        };
        newBoard[row][col] = newNode;
    }
    return newBoard;
}

function shortWay(goal){
    var shortPath = [];
    var currNode = goal;
    while(currNode.parent!==null){
        shortPath.unshift(currNode)
        currNode = currNode.parent;
    }
    shortPath.unshift(currNode);
    return shortPath;
}