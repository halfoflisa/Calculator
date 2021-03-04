const numberBtns = document.querySelectorAll('.numberBtn');
const operatorBtns = document.querySelectorAll('.operatorBtn');
const pointBtn = document.querySelector('.pointBtn');
const equalBtn = document.querySelector('.equalBtn');
const deleteBtn = document.querySelector('.deleteBtn');
const clearBtn = document.querySelector('.clearBtn');
const allClearBtn = document.querySelector('.allClearBtn');
const screen = document.querySelector('.screen');

let userInput = '';
let operand = '';
let currOpr = '';
let pointBtnClicked = false;
let equalBtnClicked = false;
let deleteBtnClicked = false;

// キーボードサポート
window.addEventListener('keydown', function(e){
    const key = document.querySelector(`button[data-key='${e.key}']`);
    console.log(e.key);
    key.click();
});

// 数字キーが押されたとき
numberBtns.forEach( num => 
	num.addEventListener('click', () => {
        if (screen.textContent !== 'UNDEFINED'                          // エラーチェック
        && screen.textContent !== 'OVERFLOW') {
            deleteBtnClicked = false;                                   // 桁下げの無効化を解除
            if (userInput.length < 10) {                                // 数値が10桁未満の場合
                if (equalBtnClicked) {                                  // イコールキーを押した直後に数字キーを押した場合
                    allClear();                                         // 初期化
                }
                userInput += num.textContent; 　　　　　                  // UserInputの末尾に数字を追加
                screen.textContent = userInput;                         // 入力値をスクリーンに表示
            }
        } else {                                                        // エラーの場合　または　数値が10桁以上の場合
            return;                                                     // 何も処理をしない
        }
    }));

// 演算子キーをクリックしたとき
operatorBtns.forEach( opr => 
    opr.addEventListener('click', () => {
        if (screen.textContent !== 'UNDEFINED'                          // エラーチェック
            && screen.textContent !== 'OVERFLOW'){
                if (currOpr === '') {　　　　　　　　　　　　　　　　　　　　　// currOprに演算子が代入されていない場合
                    if(userInput) {                                     // 数値入力後に演算子キーを押した場合（１回目）
                        currOpr = opr.textContent;                      // currOprに演算子を代入
                        operand = userInput;                            // 入力された数値をoperandに代入
                        userInput = '';                                 // userInputを空にする
                    }                   
                } else {                                                // すでにcurrOprに演算子が代入されている場合              
                    if(userInput) {                                     // 数値入力後に演算子キーを押した場合（２回目）
                        operand = operate(operand, userInput, currOpr); // operandに計算結果を代入
                        if (String(operand).length < 11) {              // 数値が10桁以下の場合
                            screen.textContent = operand;               // 計算結果をスクリーンに表示
                            currOpr = opr.textContent;                  // ２回目の演算子をcurrOprに代入
                            userInput = '';                             // userInputを空にする
                        } else {                                        // 数値が11桁以上の場合
                            screen.textContent = 'OVERFLOW';            // エラーメッセージを表示
                        }    
                    } else {                                            // 2回続けて演算子キーが押された場合   
                        currOpr = opr.textContent;                      // 演算子を前のものと入れ替える
                    }
                }
            }
        pointBtnClicked = false;                                        // 少数点キーの無効化を解除
        equalBtnClicked = false;                                        // イコールキーの無効化を解除
        deleteBtnClicked = true;                                        // 桁下げを無効化
        return;                                                         
    }));

// 小数点キー
pointBtn.addEventListener('click', () => {
    if (screen.textContent !== 'UNDEFINED'                              // エラーチェック
    && screen.textContent !== 'OVERFLOW') {
        if (!pointBtnClicked && userInput.length < 11) {                // 小数点キーが有効　かつ　userInputの長さが10桁以下
            if (userInput === '') {                                     // userInputが空の場合
                userInput = '0';                                        // userInputに0を代入
            }
            if (equalBtnClicked) {                                      // イコールキーを押した直後に小数点キーを押した場合
                allClear();                                             // 初期化
                userInput = '0';                                        // userInputに0を代入
            }
            userInput += pointBtn.textContent;                          // userInputの末尾に小数点を追加
            screen.textContent = userInput;                             // 入力値をスクリーンに表示
            pointBtnClicked = true;                                     // 少数点キーの入力を無効化           
        }
    }
    return;                                                             // 何も処理をしない                                                             
});

// イコールキー
equalBtn.addEventListener('click', () => {
    if (screen.textContent !== 'UNDEFINED'                              // エラーチェック
    && screen.textContent !== 'OVERFLOW') {
        if (currOpr && !equalBtnClicked) {                              // currOprに演算子が代入されている　かつ　イコールキーが有効
            operand = operate(operand, userInput, currOpr);             // operandに計算結果を代入
            screen.textContent = operand;                               // 計算結果をスクリーンに表示
            userInput = '';                                             // userInputを空にする
            pointBtnClicked = false;                                    // 小数点キーの入力を有効化
            equalBtnClicked = true;                                     // イコールキーを入力を無効化
            deleteBtnClicked = true;                                    // 桁下げの入力を無効化
        }
    }
    return;                                                             // 何も処理をしない
});

// 桁下げ（表示している数値の最小桁の数字を1桁ずつ消去）をクリックしたとき
deleteBtn.addEventListener('click', () => {
    if (!deleteBtnClicked) {                                            // 桁下げが無効化されていないとき
        if (userInput.length > 1) {                                     // ２桁以上の数値を消すとき
            if (userInput.charAt(userInput.length - 1) === '.') {       // 数値の末尾が小数点の場合
                pointBtnClicked = false;                                // 少数点キーを有効化
            }
            userInput = userInput.slice(0, -1);                         // 数値の末尾を消去
            screen.textContent = userInput;                             // 数値をスクリーンに表示
        } else {                                                        // 最後の１文字を消すとき
            userInput = '';                                             // userInputを空にする
            screen.textContent = 0;                                     // スクリーンに0を表示
        }
        return;                                                         // 何も処理をしない
    }
});

// クリアキー
clearBtn.addEventListener('click', () => {
    if (!deleteBtnClicked) {                                            // 桁下げが有効のとき
        userInput = '';                                                 // userInputを空にする
        screen.textContent = 0;                                         // スクリーンに0を表示
    }
    return;                                                             // 何も処理をしない
});

// オールクリアキー
allClearBtn.addEventListener('click', allClear);
function allClear() {
    userInput = '';
    operand = '';
    currOpr = '';
    pointBtnClicked = false;
    equalBtnClicked = false;
    deleteBtnClicked = false;
    screen.textContent = '0';
};

// 計算用の関数
function operate(x, y, op) {
    x = parseFloat(x);
    y = parseFloat(y);
    let result = '';
    
    if(op === '+') {
        result = x + y;
    } else if(op === '-') {
        result = x - y;
    } else if(op === '×') {
        result = x * y;
    } else if(op === '÷') {
        if(y === 0) {
            result = 'UNDEFINED';
        } else {
            result = x / y;
        }
    }
    
    if (result >= 0) {                                                  // 計算結果が0以上の場合
        result = Math.round(result * 1000) / 1000;                      // 丸めた計算結果を代入
        return result;
    } else if (result < 0) {                                            // 計算結果が0以下の場合
        result = '-' + Math.round(String(result).slice(1) * 1000) / 1000; // 絶対値を丸めたあと符号をつけて代入
        return result;
    } else if (result === 'UNDEFINED') {                                // UNDEFINEDのとき
        return result;                                                  // そのまま返す
    }
}