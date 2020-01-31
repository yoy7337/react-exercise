import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className={props.className}
            onClick={props.onClick}>
            {props.value}
        </button>
    );
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
        [2, 4, 6]
    ]

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], winIndexes: [a, b, c] };
        }
    }

    return { winner: null, winIndexes: null };
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            className={(this.props.winIndexes && this.props.winIndexes.includes(i)) ? "squareWin" : "square"}
        />;
    }

    render() {
        let render = [];
        for (let i = 0; i < 3; i++) {
            const columns = [];
            for (let j = 0; j < 3; j++) {
                columns.push(this.renderSquare(i * 3 + j));
            }
            render.push(<div key={i} className="board-row"> {columns}</div>)
        }

        return (
            <div>
                {render}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    position: null,
                    player: null
                }
            ],
            xIsNext: true,
            stepNumber: 0,
            reverseMovesVal: false
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squares.slice();
        const { winner } = calculateWinner(squares);
        if (winner || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: history.concat([{
                squares: squares,
                position: i,
                player: squares[i]
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    reverseMoves() {
        this.setState({
            reverseMovesVal: !this.state.reverseMovesVal
        })
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const { winner, winIndexes } = calculateWinner(current.squares);
        const reverseMovesVal = this.state.reverseMovesVal

        const reverseMove = <button onClick={() => this.reverseMoves()}>{reverseMovesVal ? "Normal Moves order" : "Reverse"}</button>

        const moves = history.map((step, move) => {
            const desc = move ?
                `Go to move #${move}, position(${Math.floor(step.position / 3)}, ${step.position % 3}), player(${step.player})` :
                'Go to game start'

            return (
                <li key={move}>
                    <button className="history" onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })
        const movesRender = reverseMovesVal ?
            <ol reversed>{moves.reverse()}</ol> :
            <ol>{moves}</ol>

        let status;
        if (winner) {
            status = 'Winner is ' + winner
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        }


        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winIndexes={winIndexes}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>{reverseMove}</div>
                    {movesRender}
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
