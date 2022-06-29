var num = 1;
var num2 = -1;
var num3 = 0;
var confirm;

if(num3 > 0){
    confirm = "양수"        // 조건식이 참인 경우 실행
}else if(num3 < 0){
    confirm = "음수"        // 0보다 크다는 조건식이 거짓이고, 
                            //0보다 작다는 조건식이 참인 경우
}else{
    confirm = "영"          //if문에 있는 모든 조건식이 거짓인 경우 실행
}
console.log(confirm)