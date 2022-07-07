import React, {Component} from "react";
import {bfs} from "../algorithm/bfs"
import Node from "./node/Node"
import "./PathFind.css"
import Button from 'react-bootstrap/Button';
import {dfs} from "../algorithm/dfs"
import 'bootstrap/dist/css/bootstrap.min.css';


const numOfRows = 20;
const numOfColumns = 50;

export default class PathFind extends Component{
    constructor(){
        super();
        this.state = {
            board: [],
            STARTNODE_ROW: 10,
            STARTNODE_COL: 15,
            GOALNODE_ROW: 16,
            GOALNODE_COL: 30,
            mouseIsPressed: false,
            isRunning: false,
            isBoardClean: true,
            isStartNode: false,
            isGoalNode: false,
            numOfExpandedNodes: 0,
            numOfPathNodes: 0
        }
    }
    //after initialization of web, first function that will be executed
    componentDidMount(){
        this.setState({board: this.getInitBoard()});
    }
    
    handleMouseDown(row, col){
        const{board} = this.state;
        const newBoard = wallGenerate(board, row, col);
        this.setState({board: newBoard, mouseIsPressed: true});
        console.log('c');
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



    search(algo){
        if(this.state.isBoardClean){
            this.setState({isBoardClean: false});
            this.setState({isRunning: true});
            var{board} = this.state;
            var start = board[this.state.STARTNODE_ROW][this.state.STARTNODE_COL];
            var goal = board[this.state.GOALNODE_ROW][this.state.GOALNODE_COL];
            var visited;
            switch(algo){
                case "bfs":
                    visited = bfs(board, start, goal);
                    break;
                case "dfs":
                    visited = dfs(board, start, goal);
                    break;
                default:
                    console.log("Nice");
                }  
            
            if(visited === 0){
                alert("There is no path");
                console.log("There is no way");
            }
            else{
                var way = shortWay(goal);
                this.visualise(visited, way);
                setTimeout(()=>{
                    this.setState({isRunning: false});
                }, 2000);
            }
        }
        
    }
    
    
    
    visualise(visited, path){
        for(var i = 0; i<=visited.length; i++){
            this.setState({numOfExpandedNodes: visited.length, numOfPathNodes: path.length+1});
            if(i===visited.length){
                setTimeout(()=>{
                    this.animatePath(path)
                }, 10*i);
                return;
            }
            const node = visited[i];
            if(node.isStart){
                continue;
            }
            else{
                setTimeout(()=>{
                    document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
                }, 10*i)
            }
            
        }
    }
    
    clearGrid(){
        if(!this.state.isRunning){
            const {board} = this.state;
            for(var i = 0; i<board.length; i++){
                for(var j = 0; j<board[0].length; j++){
                    const node = board[i][j];
                    if(!node.isStart && !node.isGoal){
                        document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
                        node.isVisited = false;
                    }
                    if(node.isWall){
                        node.isWall = false;
                    }
                }
            }
            this.setState({isBoardClean: true, numOfExpandedNodes: 0, numOfPathNodes: 0});
        }
    }
    
    animatePath(path){
        for(var i = 0; i<path.length; i++){
            const node = path[i];
            setTimeout(()=>{
                document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-path';
            }, 10*i);
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
           <span style = {{marginRight: "510px"}} >Expanded nodes: {this.state.numOfExpandedNodes}</span>
                <span style = {{marginLeft: "510px"}}>Path Length: {this.state.numOfPathNodes}</span>
            <div className="instructions">
                <div className = "instructions-item">
                    unvisited node
                </div>
                <div className = "instructions-item">
                
                    visited node
                </div>
                <div className = "instructions-item">
                    start
                </div>
                <div className = "instructions-item">
                
                    goal
                </div>
            </div>
            <div className = "grid">
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
              <div class="buttons">
            <Button variant="outline-primary" onClick={() => this.search("dfs")}>DFS</Button>{' '}
            <Button variant="outline-primary" onClick={() => this.search("bfs")}>BFS</Button>{' '}
            <Button variant="outline-primary" onClick={() => this.clearGrid()}>Clear Grid</Button>{' '}
            <Button variant="outline-primary" onClick={() => this.changeTheme()}>Dark Mode</Button>{' '}
              </div>
            </div>
          </>
        );
      }
    }

const wallGenerate = (board, row, col)=>{
    const newBoard = board.slice();
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
    while(currNode.parent.parent!==null){
        currNode = currNode.parent;
        shortPath.unshift(currNode)
        
    }
    return shortPath;
}