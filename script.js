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
        if (screen.textContent !== 'UNDEFINED'                          // エラーでない場合
        && screen.textContent !== 'OVERFLOW') {
            deleteBtnClicked = false;                                   // 桁下げの無効化を解除
            if (userInput.length < 10) {                                // 数値の桁数が10未満の場合
                if (equalBtnClicked) {                                  // イコールキーを押した直後に数字キーを押した場合
                    allClear();                                         // 最初に戻る
                }
                userInput += num.textContent; 　　　　　                  // UserInputの末尾に数字を順番に追加
                screen.textContent = userInput;                         // 入力値をスクリーンに表示
            }
        } else {                                                        // エラーの場合　または　数値の桁数が10以上の場合
            return;                                                     // 何も処理をしない
        }
    }));

// 演算子キーをクリックしたとき
operatorBtns.forEach( opr => 
    opr.addEventListener('click', () => {
        if (screen.textContent !== 'UNDEFINED'                          // エラーでない場合
            && screen.textContent !== 'OVERFLOW'){
                if (currOpr === '') {　　　　　　　　　　　　　　　　　　　　　// currOprに演算子が代入されていない場合
                    if(userInput) {                                     // 数値入力後に演算子キーを押したとき（１回目）
                        currOpr = opr.textContent;                      // currOprに演算子を代入
                        operand = userInput;                            // 入力された数値をoperandに代入
                        userInput = '';                                 // userInputを空にする
                    }                   
                } else {                                                // すでにcurrOprに演算子が代入されている場合              
                    if(userInput) {                                     // 数値入力後に演算子キーを押したとき（２回目）
                        operand = operate(operand, userInput, currOpr); // operandに計算した数値を代入
                        if (String(operand).length < 11) {              // 数値の桁数が10以下の場合
                            screen.textContent = operand;               // 計算結果をスクリーンに表示
                            currOpr = opr.textContent;                  // ２回目の演算子をcurrOprに代入
                            userInput = '';                             // userInputを空にする
                        } else {                                        // 数値の桁数が11以上の場合
                            screen.textContent = 'OVERFLOW';            // エラーメッセージを表示
                        }    
                    } else {                                            // 2回続けて演算子キーが押された場合   
                        currOpr = opr.textContent;                      // 演算子を前のものと入れ替える
                    }
                }
            }
        pointBtnClicked = false;                                        // 少数点キーの無効化を解除
        equalBtnClicked = false;
        deleteBtnClicked = true;                                        // 桁下げを無効化
        return;                                                         // 何も処理をしない
    }));

// 少数点キー
pointBtn.addEventListener('click', () => {
    if (screen.textContent !== 'UNDEFINED'                              // エラーでない場合
    && screen.textContent !== 'OVERFLOW') {
        if(userInput && !pointBtnClicked && userInput.length < 11) {    // 数値が未入力でない　かつ　少数点キーが無効化されていない　かつ　数値の桁数が10未満の場合
            userInput += pointBtn.textContent;                          // userInputの末尾に少数点を追加
            screen.textContent = userInput;                             // 入力値をスクリーンに表示
            pointBtnClicked = true;                                     // 少数点キーの入力を無効化
        }
    }
    return;                                                             // 何も処理をしない                                                             
});

// イコールキー
equalBtn.addEventListener('click', () => {
    if (screen.textContent !== 'UNDEFINED'                              // エラーでない場合
    && screen.textContent !== 'OVERFLOW') {
        if (userInput && !equalBtnClicked) {                            // currOprに演算子が代入されている　かつ　イコールキーが無効化されていない
            operand = operate(operand, userInput, currOpr);             // operandに計算した数値を代入
            screen.textContent = operand;                               // 計算結果をスクリーンに表示
            userInput = '';                                             // userInputを空にする
            pointBtnClicked = false;                                    // 少数点キーの無効化を解除
            equalBtnClicked = true;                                     // イコールキーの入力を無効化
            deleteBtnClicked = true;                                    // 桁下げの入力を無効化
        }
    }
    return;
});

// 桁下げ（表示している数値の最小桁の数字を1桁ずつ消去）をクリックしたとき
deleteBtn.addEventListener('click', () => {
    if (!deleteBtnClicked) {                                            // 桁下げが無効化されていないとき
        if (userInput.length > 1) {                                     // ２桁以上の数値を消すとき
            userInput = userInput.slice(0, -1);                         // 数値の末尾を1文字ずつ消去
            screen.textContent = userInput;                             // 数値をスクリーンに表示
        } else {                                                        // 最後の１文字を消すとき
            userInput = '';                                             // userInputを空にする
            screen.textContent = 0;                                     // スクリーンに0を表示
        }
        return;                                                         // 格下げが無効化されているときは何もしない
    }
});

// クリアキー
clearBtn.addEventListener('click', () => {
    if (!deleteBtnClicked) {                                            // 桁下げが無効化されていないとき
        userInput = '';                                                 // userInputを空にする
        screen.textContent = 0;                                         // スクリーンに0を表示
    }
    return;                                                             // 格下げが無効化されているときは何もしない
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
    if(op === '+') {
        return x + y;
    } else if(op === '-') {
        return x - y;
    } else if(op === '×') {
        return x * y;
    } else if(op === '÷') {
        if(y === 0) {
            return 'UNDEFINED';
        } else {
        return x / y;
        }
    }
}
