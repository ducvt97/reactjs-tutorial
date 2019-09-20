import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props){
    return (
        <button className={props.className}
            onClick={()=>props.onClick()}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        let winner = this.props.winner;
        let className = "square";
        if (winner){
            className += winner.includes(i) ? " square-winner" : "";
        }
        return (
            <Square 
                key={i}
                className={className}
                value={this.props.squares[i]}
                onClick={()=>this.props.onClick(i)}
            />
        );
    }

    render() {
        let board = [];
        let row = [];
        for (let i = 1; i < 10; i++){
            row.push(this.renderSquare(i - 1));
            if(i % 3 === 0){
                board.push(
                    <div className="board-row" key={i/3}>
                        {row}
                    </div>);
                row = [];
            }
        }

        return (
            <div>
                {board}
            </div>
        );
    }
}

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
            return lines[i];
        }
    }
    return null;
}

const location = [
    null,
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
];

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            ascending: true,
            xIsNext: true,
        };
    }
    
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        
        let moves;

        if (this.state.ascending){
            moves = history.map((step, move) => {
                const desc = move ?
                    'Go to move #' + move + " (" + location[move][0] + "," + location[move][1] + ")" :
                    'Go to game start';
                let moveClassName = move === this.state.stepNumber ? "current-move" : "";
                return (
                    <li key={move}>
                        <button className={moveClassName} onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
            });
        } else {
            moves = [];
            for (let i = history.length - 1; i >= 0; i--){
                const desc = i > 0 ?
                    'Go to move #' + i + " (" + location[i][0] + "," + location[i][1] + ")" :
                    'Go to game start';
                let moveClassName = i === this.state.stepNumber ? "current-move" : "";
                moves.push(
                    <li key={i}>
                        <button className={moveClassName} onClick={() => this.jumpTo(i)}>{desc}</button>
                    </li>
                );
            }
        }

        let status;
        if (winner === null && this.state.stepNumber >= 9){
            status = "Draw. No one win!!"
        } else if (winner){
            status = 'Winner: ' + current.squares[winner[0]];
        } else {
            status = 'Next player: ';
            status += this.state.xIsNext ? 'X' : 'O';
        }
        //const status = winner ? ('Winner: ' + current.squares[winner[0]]) : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        const sortDesc = this.state.ascending ? "Sort: Ascending" : "Sort: Descending";

        return (
            <div className="game">
                <div className="game-board">
                <Board
                    squares={current.squares}
                    winner={winner}
                    onClick={(i) => this.handleClick(i)}
                />

                </div>
                <div className="game-info">
                <div>{status}</div>
                <div>
                    <button onClick={() => this.changeSortMode()}>{sortDesc}</button>
                </div>
                <ol>{moves}</ol>
                </div>
            </div>
        );
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: this.state.stepNumber + 1,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    changeSortMode(){
        this.setState({
            ascending: !this.state.ascending,
        });
    }
}
  
  // ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);