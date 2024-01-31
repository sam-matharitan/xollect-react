import { useState } from "react";
import './App.css';

function Square({ value, styleCt, onSquareClicked }) {
  return (
    <div className="grid-cell">
      <div className={"square " + ("sq" + styleCt)} onClick={onSquareClicked}>
      </div>
    </div>
  );
}

function Board({ isSetup, numberOfRows, numberOfColumns, squares, onPlace, onSelect }) {
  
  function handleClick(row, col) {
    const nextSquares = squares.map((arr, i) => arr.slice().map((e,i2) => Math.abs(e)));
    
    if (isSetup) {
      onPlace(row, col, nextSquares);
    } else {
      onSelect(row, col, nextSquares);
    }
  }

  return (
    <>
      {squares.map((e, i) => {
        return (
          <div key={-i} className="board-row">
            {squares[i].map((e2, i2) => {
              return (
                <Square key={i*numberOfRows+i2} value={squares[i][i2]} styleCt={squares[i][i2]} onSquareClicked={() => handleClick(i, i2)} />
              )
            })}
          </div>
        )
      })}
    </>
  );
}

export default function Game() {
  const [isBackgroundRotatingOn, setIsBackgroundRotatingOn] = useState(true);
  const [numberOfRows, setNumberOfRows] = useState(7);
  const [numberOfColumns, setNumberOfColumns] = useState(7);
  const [isSetup, setIsSetup] = useState(false);
  const [isPlayEnabled, setIsPlayEnabled] = useState(true);
  const [currentSquares, setCurrentSquares] = useState([[0,0,1,0,1,0,0]
                                                      ,[0,1,0,1,0,1,0]
                                                      ,[0,0,0,0,0,0,0]
                                                      ,[1,0,0,-1,0,0,1]
                                                      ,[0,0,0,0,0,0,0]
                                                      ,[0,1,0,1,0,1,0]
                                                      ,[0,0,1,0,1,0,0]]);
  const [startingSquares, setStartingSquares] = useState([[0,0,1,0,1,0,0]
                                                        ,[0,1,0,1,0,1,0]
                                                        ,[0,0,0,0,0,0,0]
                                                        ,[1,0,0,-1,0,0,1]
                                                        ,[0,0,0,0,0,0,0]
                                                        ,[0,1,0,1,0,1,0]
                                                        ,[0,0,1,0,1,0,0]]);
  const [selectedRow, setSelectedRow] = useState(3);
  const [selectedCol, setSelectedCol] = useState(3);
  const [hasWon, setHasWon] = useState(false);
  const [rotateLabel, setRotateLabel] = useState("Stop Rotating Land");
  const [playLabel, setPlayLabel] = useState("Edit");
  const [storedSquares, setStoredSquares] = useState(null);
  const [rulesShowing, setRulesShowing] = useState(false);

  function populateAndPlay(squares) {
    setHasWon(false);
    setCurrentSquares(squares);
    setPlayLabel("Edit");
    setIsPlayEnabled(true);
    setIsSetup(false);
  }

  function handleEasyClick() {
    const nextSquares = [[0,0,1,0,1,0,0]
                        ,[0,1,0,1,0,1,0]
                        ,[0,0,0,0,0,0,0]
                        ,[1,0,0,-1,0,0,1]
                        ,[0,0,0,0,0,0,0]
                        ,[0,1,0,1,0,1,0]
                        ,[0,0,1,0,1,0,0]];
    setStartingSquares(nextSquares.map((arr, i) => arr.slice().map((e,i2) => e)));
    populateAndPlay(nextSquares);
    setSelectedRow(3);
    setSelectedCol(3);
  }

  function handleRestartClick() {
    if (hasWon || (isPlayEnabled && !isSetup)) {
      const nextSquares = startingSquares.map((arr, i) => arr.slice().map((e,i2) => e));
      populateAndPlay(nextSquares);
      setSelectedRow(3);
      setSelectedCol(3);
    }
  }

  function handleRandomClick() {
    function r(max) {
      return Math.floor(Math.random()*(1+max));
    }
    const nextSquares = [[r(1),r(1),r(1),r(1),r(1),r(1),r(1)]
                        ,[r(1),r(1),r(1),r(1),r(1),r(1),r(1)]
                        ,[r(1),r(1),r(1),r(1),r(1),r(1),r(1)]
                        ,[r(1),r(1),r(1),r(1),r(1),r(1),r(1)]
                        ,[r(1),r(1),r(1),r(1),r(1),r(1),r(1)]
                        ,[r(1),r(1),r(1),r(1),r(1),r(1),r(1)]
                        ,[r(1),r(1),r(1),r(1),r(1),r(1),r(1)]];
    setStartingSquares(nextSquares.map((arr, i) => arr.slice().map((e,i2) => e)));
    populateAndPlay(nextSquares);
    setSelectedRow(3);
    setSelectedCol(3);
  }

  function handleRotateEarthChanged() {
    if (!isBackgroundRotatingOn) {
      setRotateLabel("Stop Rotating Land");
    } else {
      setRotateLabel("Rotate Land");
    }
    setIsBackgroundRotatingOn(!isBackgroundRotatingOn);
  }

  function handleSetupModeChanged() {
    const nextSquares = currentSquares.map((arr, i) => arr.slice().map((e,i2) => Math.abs(e)));
    if (!isSetup) {
      setPlayLabel("Play");
      setSelectedRow(null);
      setSelectedCol(null);
      setCurrentSquares(nextSquares);
      setIsSetup(true);
    } else if (isPlayEnabled && updateIfValid(selectedRow, selectedCol, nextSquares, true)) {
      setPlayLabel("Edit");
      setStartingSquares(nextSquares.map((arr, i) => arr.slice().map((e,i2) => e)));
      setCurrentSquares(nextSquares);
      setIsSetup(false);
    } else {
      setIsSetup(true);
      setIsPlayEnabled(false);
    }
  }

  function handlePlace(row, col, nextSquares) {
    nextSquares[row][col] = (nextSquares[row][col] + 1) % 2;
    setCurrentSquares(nextSquares);

    if (updateIfValid(selectedRow, selectedCol, nextSquares, true, true)) {
      setIsPlayEnabled(true);
    } else {
      setIsPlayEnabled(false);
    }
  }

  function handleSelect(row, col, nextSquares) {
    if (!hasWon) {
      nextSquares[row][col] *= -1;
      setSelectedRow(row);
      setSelectedCol(col);
      setCurrentSquares(nextSquares);
    }
  }

  function handleOnKeyDown(event) {
    const c = String.fromCharCode(event.keyCode);
    if (c === 'R') {
      handleRotateEarthChanged();
    } else if (!hasWon) {
      if (c === 'E') {
        handleSetupModeChanged();
      } else if (!isSetup) {
        const nextSquares = currentSquares.map((arr, i) => arr.slice().map((e,i2) => e));
        if (c === 'W') {
          if (nextSquares[0][selectedCol] === 0) {
            for (let i = 0; i < numberOfRows - 1; i++) {
              nextSquares[i][selectedCol] = nextSquares[i+1][selectedCol];
            }
            nextSquares[numberOfRows-1][selectedCol] = 0;
            updateIfValid(selectedRow - 1, selectedCol, nextSquares);
          }
        } else if (c === 'D') {
          if (nextSquares[selectedRow][numberOfColumns - 1] === 0) {
            for (let i = numberOfColumns - 1; i > 0; i--) {
              nextSquares[selectedRow][i] = nextSquares[selectedRow][i-1];
            }
            nextSquares[selectedRow][0] = 0;
            updateIfValid(selectedRow, selectedCol + 1, nextSquares);
          }
        } else if (c === 'S') {
          if (nextSquares[numberOfRows - 1][selectedCol] === 0) {
            for (let i = numberOfRows - 1; i > 0; i--) {
              nextSquares[i][selectedCol] = nextSquares[i-1][selectedCol];
            }
            nextSquares[0][selectedCol] = 0;
            updateIfValid(selectedRow + 1, selectedCol, nextSquares);
          }
        } else if (c === 'A') {
          if (nextSquares[selectedRow][0] === 0) {
            for (let i = 0; i < numberOfColumns - 1; i++) {
              nextSquares[selectedRow][i] = nextSquares[selectedRow][i+1];
            }
            nextSquares[selectedRow][numberOfColumns - 1] = 0;
            updateIfValid(selectedRow, selectedCol - 1, nextSquares);
          }
        } else if (event.code == 'ArrowLeft') {
          if (selectedCol > 0) {
            nextSquares[selectedRow][selectedCol] *= -1;
            nextSquares[selectedRow][selectedCol-1] *= -1;
            setSelectedCol(selectedCol-1);
            setCurrentSquares(nextSquares);
          }
        } else if (event.code == 'ArrowRight') {
          if (selectedCol < numberOfColumns - 1) {
            nextSquares[selectedRow][selectedCol] *= -1;
            nextSquares[selectedRow][selectedCol+1] *= -1;
            setSelectedCol(selectedCol+1);
            setCurrentSquares(nextSquares);
          }
        } else if (event.code == 'ArrowUp') {
          if (selectedRow > 0) {
            nextSquares[selectedRow-1][selectedCol] *= -1;
            nextSquares[selectedRow][selectedCol] *= -1;
            setSelectedRow(selectedRow-1);
            setCurrentSquares(nextSquares);
          }
        } else if (event.code == 'ArrowDown') {
          if (selectedCol < numberOfRows - 1) {
            nextSquares[selectedRow][selectedCol] *= -1;
            nextSquares[selectedRow+1][selectedCol] *= -1;
            setSelectedRow(selectedRow+1);
            setCurrentSquares(nextSquares);
          }
        }
      }
    }
    if (c === 'N') {
      const nextSquares = Array(numberOfRows).fill(Array(numberOfColumns).fill(0));
      setCurrentSquares(nextSquares);
      setIsPlayEnabled(false);
      setPlayLabel("Play");
      setIsSetup(true);
      setHasWon(false);
    }
  }

  function handleResetClick() {
    const nextSquares = Array(numberOfRows).fill(Array(numberOfColumns).fill(0));
    setCurrentSquares(nextSquares);
    setIsPlayEnabled(false);
    setPlayLabel("Play");
    setIsSetup(true);
    setHasWon(false);
  }

  function handleRulesClick() {
    setRulesShowing(!rulesShowing);
  }

  function handleStoreClick() {
    if (!currentSquares.some(r => r.includes(4))) {
      const temp = currentSquares.map((arr, i) => arr.slice().map((e,i2) => e));
      setStoredSquares(temp);
    }
  }

  function handleRecallClick() {
    if (storedSquares !== null) {
      setHasWon(false);
      const temp = storedSquares.map((arr, i) => arr.slice().map((e,i2) => isSetup ? Math.abs(e) : e));
      setCurrentSquares(temp);
      setSelectedRow(selectedRow);
      setSelectedCol(selectedCol);
      if (isSetup) {
        if (updateIfValid(selectedRow, selectedCol, temp, true, true)) {
          setIsPlayEnabled(true);
        } else {
          setIsPlayEnabled(false);
        }
      } else if (!updateIfValid(selectedRow, selectedCol, temp, true, true)) {
        setPlayLabel("Play");
        setIsPlayEnabled(false);
        setIsSetup(true);
      } else {
        setPlayLabel("Edit");
        setIsPlayEnabled(true);
        setIsSetup(false);
      }
    }
  }

  function handleClearClick() {
    setStoredSquares(null);
  }

  function handleControlDownClick() {
    if (!hasWon && !isSetup) {
      const nextSquares = currentSquares.map((arr, i) => arr.slice().map((e,i2) => e));
      if (nextSquares[numberOfRows - 1][selectedCol] === 0) {
        for (let i = numberOfRows - 1; i > 0; i--) {
          nextSquares[i][selectedCol] = nextSquares[i-1][selectedCol];
        }
        nextSquares[0][selectedCol] = 0;
        updateIfValid(selectedRow + 1, selectedCol, nextSquares);
      }
    }
  }

  function handleControlUpClick() {
    if (!hasWon && !isSetup) {
      const nextSquares = currentSquares.map((arr, i) => arr.slice().map((e,i2) => e));
      if (nextSquares[0][selectedCol] === 0) {
        for (let i = 0; i < numberOfRows - 1; i++) {
          nextSquares[i][selectedCol] = nextSquares[i+1][selectedCol];
        }
        nextSquares[numberOfRows-1][selectedCol] = 0;
        updateIfValid(selectedRow - 1, selectedCol, nextSquares);
      }
    }
  }

  function handleControlLeftClick() {
    if (!hasWon && !isSetup) {
      const nextSquares = currentSquares.map((arr, i) => arr.slice().map((e,i2) => e));
      if (nextSquares[selectedRow][0] === 0) {
        for (let i = 0; i < numberOfColumns - 1; i++) {
          nextSquares[selectedRow][i] = nextSquares[selectedRow][i+1];
        }
        nextSquares[selectedRow][numberOfColumns - 1] = 0;
        updateIfValid(selectedRow, selectedCol - 1, nextSquares);
      }
    }
  }

  function handleControlRightClick() {
    if (!hasWon && !isSetup) {
      const nextSquares = currentSquares.map((arr, i) => arr.slice().map((e,i2) => e));
      if (nextSquares[selectedRow][numberOfColumns - 1] === 0) {
        for (let i = numberOfColumns - 1; i > 0; i--) {
          nextSquares[selectedRow][i] = nextSquares[selectedRow][i-1];
        }
        nextSquares[selectedRow][0] = 0;
        updateIfValid(selectedRow, selectedCol + 1, nextSquares);
      }
    }
  }

  function updateIfValid(row, col, nextSquares, checkStart, isPlacement) {

    // Check to see if all '1' squares are contiguous adjacent and if so it is a win state
    // Otherwise, the board should be valid already (no rules to check other than win state)
    
    let squareCt = 0;
    let path =  [[0,0,0,0,0,0,0]
                ,[0,0,0,0,0,0,0]
                ,[0,0,0,0,0,0,0]
                ,[0,0,0,0,0,0,0]
                ,[0,0,0,0,0,0,0]
                ,[0,0,0,0,0,0,0]
                ,[0,0,0,0,0,0,0]];

    for (let i = 0; i < numberOfRows; i++) {
      for (let j = 0; j < numberOfColumns; j++) {
        if (nextSquares[i][j] !== 0) {
          squareCt++;
        }
      }
    }

    if (isPlacement) {
      if (squareCt === 0) {
        return false;
      }
    }

    if (!isPlacement) {

      let contiguousCt = 0;

      function walkContiguous(r, c) {
        path[r][c] = 1;
        let count = 1;
        if (r - 1 >= 0 && path[r-1][c] !== 1 && nextSquares[r - 1][c] !== 0) {
          count += walkContiguous(r - 1, c);
        }
        
        if (r + 1 < numberOfRows && path[r+1][c] !== 1 && nextSquares[r + 1][c] !== 0) {
          count += walkContiguous(r + 1, c);
        }
        
        if (c - 1 >= 0 && path[r][c-1] !== 1 && nextSquares[r][c-1] !== 0) {
          count += walkContiguous(r, c - 1);
        }
        
        if (c + 1 < numberOfColumns && path[r][c+1] !== 1 && nextSquares[r][c+1] !== 0) {
          count += walkContiguous(r, c + 1);
        }
        
        return count;
      }

      for (let i = 0; i < numberOfRows; i++) {
        for (let j = 0; j < numberOfColumns; j++) {
          if (nextSquares[i][j] !== 0) {
            contiguousCt = walkContiguous(i, j);
            break;
          }
        }
        if (contiguousCt !== 0) {
          break;
        }
      }

      if (squareCt === contiguousCt) {
        setHasWon(true);
        setIsPlayEnabled(false);
        for (let i = 0; i < numberOfRows; i++) {
          for (let j = 0; j < numberOfColumns; j++) {
            if (nextSquares[i][j] === 0) {
              nextSquares[i][j] = 3;
            } else {
              nextSquares[i][j] = 4;
            }
          }
        }
      }

      if (!checkStart) {
        setSelectedRow(row);
        setSelectedCol(col);
        setCurrentSquares(nextSquares);
      }
    }

    return true;
  }

  return (
    <>
      <div className="App" onKeyDown={handleOnKeyDown}>
        <div className="App-inner">
          <div className="App-content">
            <div className={"App-header-rules" + (rulesShowing ? "" : "-hidden")}>
              <div className={"closeRules" + (rulesShowing ? "" : "-hidden")} onClick={handleRulesClick}>×</div>
              <div className="toast-rules">
                <div className="rules">
                  <span className = "engraved app-setting-title">The Rules</span>
                  <span className = "app-setting-subtitle">Ice Shards</span>
                  <div className="App-settings-buttons">
                    <div className="sq1-rules"></div>
                  </div>
                  <span className="app-setting-desc">Ice Shards will freeze together when ALL Ice Shards are in a contiguous arrangement, causing the game to end. Think contiguous as in the lower 48 contiguous States of the US.</span>
                  <span className = "engraved app-setting-title">How to Edit</span>
                  <span className = "app-setting-subtitle">Order of Placement</span>
                  <div className="App-settings-buttons">
                    <div className="sq0-rules"></div>
                    <div className="sq1-rules"></div>
                    <div className="sq0-rules"></div>
                  </div>
                  <span className="app-setting-desc">During Edit mode, selecting one of the above types of items in the 'Order of Placement' arrangement will turn it into the item to the right of it in the order.</span>
                  <span className = "engraved app-setting-title">How to Move</span>
                  <div className="App-settings-buttons">
                    <div className="sq-1-rules"></div>
                  </div>
                  <span className="app-setting-desc">During Play mode, selecting an Ice Shard will highlight it as above, signifying it being selected.</span>
                  <div className="App-settings-buttons">
                    <div className="control-up-rules"></div>
                    <div className="control-right-rules"></div>
                    <div className="control-down-rules"></div>
                    <div className="control-left-rules"></div>
                  </div>
                  <span className="app-setting-desc">Once selected, pressing one of the above Wind Gusts will move the entire row or column that the selected Ice Shard is in in the direction towards the selected Wind Gust, unless an Ice Shard would be moved off the grid.</span>
                  <span className = "engraved app-setting-title">The Goal</span>
                  <div className="App-settings-buttons">
                    <div className="sq4-rules"></div>
                  </div>
                  <span className="app-setting-desc">The goal of the game is to make the Ice Shards freeze in an arrangement that minimizes the amount of empty space contained within the smallest rectangle that surrounds the contiguous structure of frozen Ice Shards.</span>
                  <div className="App-settings-buttons"></div>
                  <div className="App-settings-buttons"></div>
                </div>
              </div>
            </div>
            <header className={"App-header" + (rulesShowing ? " blur" : "")}>
              <div className="App-logo"><span className = "engraved app-title">XOLLECT</span></div>
            </header>
            <div className={"game" + (rulesShowing ? " blur" : "")} tabIndex="0">
              <div className="ocean-border">

              </div>
              <div className={"game-border" + (isBackgroundRotatingOn ? " rotating" : "")}>
                
              </div>
              <div className={"dirt-border" + (isBackgroundRotatingOn ? " rotating" : "")}>
                
              </div>
              <div className="controls">
                <div className="control-up" onClick={handleControlUpClick}/>
                <div className="control-spacer"/>
                <div className="control-spacer"/>
                <div className="control-spacer"/>
                <div className="control-spacer"/>
                <div className="control-spacer"/>
                <div className="control-spacer-middle">
                  <div className="control-left" onClick={handleControlLeftClick}/>
                  <div className="control-spacer-row"/>
                  <div className="control-spacer-row"/>
                  <div className="control-spacer-row"/>
                  <div className="control-spacer-row"/>
                  <div className="control-spacer-row"/>
                  <div className="control-spacer-row"/>
                  <div className="control-spacer-row"/>
                  <div className="control-spacer-row"/>
                  <div className="control-spacer-row"/>
                  <div className="control-spacer-row"/>
                  <div className="control-spacer-row"/>
                  <div className="control-right" onClick={handleControlRightClick}/>
                </div>
                <div className="control-spacer"/>
                <div className="control-spacer"/>
                <div className="control-spacer"/>
                <div className="control-spacer"/>
                <div className="control-spacer"/>
                <div className="control-down" onClick={handleControlDownClick}/>
              </div>
              <div className="game-board">
                <Board isSetup={isSetup} numberOfRows={numberOfRows} numberOfColumns={numberOfColumns} squares={currentSquares} onPlace={handlePlace} onSelect={handleSelect} />
              </div>
            </div>
            <div className={"App-footer" + (rulesShowing ? " blur" : "")}>
              <div className="App-settings-buttons">
                <div className="App-setting"><div className="App-setting-button-store" onClick={handleEasyClick}><label className="App-setting-button-label app-setting-label">E1</label></div></div>
                <div className="App-setting"><div className={"App-setting-button-recall" + ((isPlayEnabled || hasWon) ? "" : "-disabled")} onClick={handleRestartClick}><label className="App-setting-button-label app-setting-label">Restart</label></div></div>
                <div className="App-setting"><div className="App-setting-button-clear" onClick={handleRandomClick}><label className="App-setting-button-label app-setting-label">Random</label></div></div>
              </div>
              <div className="App-settings-buttons">
                <div className="App-setting"><div className={"App-setting-button-play" + (isPlayEnabled ? "" : "-disabled")} onClick={handleSetupModeChanged}><label className="App-setting-button-label app-setting-label">{playLabel}</label></div></div>
                <div className="App-setting"><div className="App-setting-button" onClick={handleResetClick}><label className="App-setting-button-label app-setting-label">Empty</label></div></div>
                <div className="App-setting"><div className="App-setting-button-rules" onClick={handleRulesClick}><label className="App-setting-button-label app-setting-label">Rules</label></div></div>
              </div>
              <div className="App-settings-buttons">
                <div className="App-setting"><div className="App-setting-button-store" onClick={handleStoreClick}><label className="App-setting-button-label app-setting-label">Store</label></div></div>
                <div className="App-setting"><div className="App-setting-button-recall" onClick={handleRecallClick}><label className="App-setting-button-label app-setting-label">Recall</label></div></div>
                <div className="App-setting"><div className="App-setting-button-clear" onClick={handleClearClick}><label className="App-setting-button-label app-setting-label">Clear</label></div></div>
              </div>
              <div className="App-settings-buttons">
                <div className="App-setting"><div className="App-setting-button-rotate" onClick={handleRotateEarthChanged}><label className="App-setting-button-label">{rotateLabel}</label></div></div>
              </div>
            </div>
            <footer className="App-footer-copyright">
              <div className="App-settings-buttons">
                <div className="App-setting"><label className="App-setting-label-copyright">© 2024, The Matharitan Group, LLC</label></div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
