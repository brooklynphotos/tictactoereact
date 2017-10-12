import React, { Component } from 'react';
import Board from './Board';
import './Game.css';

class Game extends Component {
    constructor(props){
        super(props);
        this.size = 3;
        this.state = {
            history:[{
                squares: Array(this.size*this.size).fill(null),
                cell: null
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }
    jumpTo(move){
        this.setState({
            stepNumber: move,
            xIsNext: (move % 2) ===0
        })
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step,move)=>{
            const desc = move ? `Go to move (${step.cell.x},${step.cell.y})` : 'Got to game start';
            return (
                <li key={move}>
                    <button onClick={()=>this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        let status;
        if(winner){
            status = 'Winner is '+winner;
        }else{
            status = 'Next player: '+(this.state.xIsNext ? 'X' : 'O');
        }
        const getPLFunc = (cell)=>{
            return current.squares[this.flattenIndex(cell)];
        };
        return (
            <div className="game">
            <div className="game-board">
                <Board getCellId={cell=>this.flattenIndex(cell)} dimSize={this.size} getPositionLabel={getPLFunc} onClick={(cell)=>this.handleClick(cell)}/>
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            </div>
        );
    }
    flattenIndex(cell){
        return cell.x + (cell.y*this.size);
    }
    handleClick(cell){
        const flatIndex = this.flattenIndex(cell);
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[flatIndex]){
            // already winner or square already clicked
            return;
        }
        squares[flatIndex] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares,
                cell
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }
}

export default Game;

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}